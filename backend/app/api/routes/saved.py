from typing import Literal, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from ...core.auth import get_current_user
from ...services.saved_questions import (
    list_saved_questions_for_user,
    save_question_for_user,
)

router = APIRouter(prefix="/saved", tags=["saved"])


class SaveQuestionPayload(BaseModel):
    question: str
    mode: Literal["notes", "exam"]
    source: Optional[str] = None


@router.get("")
async def list_saved(user=Depends(get_current_user)):
    return {"items": await list_saved_questions_for_user(user.get("sub", ""))}


@router.post("", status_code=201)
async def save_question(payload: SaveQuestionPayload, user=Depends(get_current_user)):
    return await save_question_for_user(
        user_id=user.get("sub", ""),
        question=payload.question,
        mode=payload.mode,
        source=payload.source,
    )
