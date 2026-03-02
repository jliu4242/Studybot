import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ...services.questions import generate_questions_from_text

router = APIRouter(prefix="/questions", tags=["questions"])
logger = logging.getLogger(__name__)


class QuestionRequest(BaseModel):
    text: str
    numQuestions: int


@router.post("/generate")
async def generate_questions(payload: QuestionRequest):
    try:
        logger.info("Received generate request: text_length=%s", len(payload.text or ""))
        content = await generate_questions_from_text(payload.text, payload.numQuestions)
        logger.info("Generated questions successfully.")
        return {"res": content}
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unexpected error generating questions.")
        raise HTTPException(status_code=500, detail="Failed to generate questions. Check server logs.") from exc
