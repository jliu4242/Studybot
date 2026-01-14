from fastapi import APIRouter
from pydantic import BaseModel

from ...services.questions import generate_questions_from_text

router = APIRouter(prefix="/questions", tags=["questions"])


class QuestionRequest(BaseModel):
    text: str


@router.post("/generate")
async def generate_questions(payload: QuestionRequest):
    content = await generate_questions_from_text(payload.text)
    return {"res": content}
