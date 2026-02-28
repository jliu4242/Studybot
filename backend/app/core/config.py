import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


class Settings:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.mongodb_uri = os.getenv("MONGODB", "")
        self.auth0_domain = os.getenv("AUTH0_DOMAIN", "")
        self.auth0_audience = os.getenv("AUTH0_AUDIENCE", "")


@lru_cache
def get_settings() -> Settings:
    return Settings()
