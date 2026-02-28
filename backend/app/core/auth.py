import logging
from functools import lru_cache
from typing import Any, Dict, Optional

import httpx
from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt

from .config import get_settings

logger = logging.getLogger(__name__)


@lru_cache
def _auth0_urls():
    settings = get_settings()
    if not settings.auth0_domain:
        return None, None
    issuer = f"https://{settings.auth0_domain}/"
    jwks_url = f"{issuer}.well-known/jwks.json"
    return issuer, jwks_url


async def _fetch_jwks(jwks_url: str) -> Dict[str, Any]:
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(jwks_url)
            response.raise_for_status()
            return response.json()
    except Exception as exc:  # broad: want to log any network/parse issues
        logger.exception("Unable to fetch JWKS from Auth0.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth service unavailable. Please try again later.",
        ) from exc


class _JWKSCache:
    def __init__(self):
        self.keys: Optional[Dict[str, Any]] = None

    async def get(self, jwks_url: str) -> Dict[str, Any]:
        if self.keys is None:
            self.keys = await _fetch_jwks(jwks_url)
        return self.keys


jwks_cache = _JWKSCache()


async def verify_jwt(request: Request) -> Dict[str, Any]:
    """
    Validate an incoming bearer token against Auth0 JWKS and return the claims payload.
    """
    settings = get_settings()
    issuer, jwks_url = _auth0_urls()
    if not issuer or not settings.auth0_audience:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Auth0 is not configured on the server.",
        )

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid.",
        )

    token = auth_header.split(" ", 1)[1]
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token header.",
        )

    jwks = await jwks_cache.get(jwks_url)
    signing_key = None
    for key in jwks.get("keys", []):
        if key.get("kid") == unverified_header.get("kid"):
            signing_key = key
            break

    if signing_key is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No matching JWK found for token.",
        )

    try:
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            audience=settings.auth0_audience,
            issuer=issuer,
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token validation failed.",
        )

    return payload


async def get_current_user(claims: Dict[str, Any] = Depends(verify_jwt)) -> Dict[str, Any]:
    """
    Dependency to inject decoded JWT claims into route handlers.
    """
    return claims
