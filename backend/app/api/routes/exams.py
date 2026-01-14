from fastapi import APIRouter, File, UploadFile

from ...services.exams import generate_exam_from_pdf

router = APIRouter(prefix="/exams", tags=["exams"])


@router.post("/generate")
async def generate_exam(file: UploadFile = File(...)):
    content = await generate_exam_from_pdf(file)
    return {"res": content}
