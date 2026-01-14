from fastapi import APIRouter, File, UploadFile

from ...services.notes import ingest_notes

router = APIRouter(prefix="/notes", tags=["notes"])


@router.post("/upload")
async def upload_notes(file: UploadFile = File(...)):
    count = await ingest_notes(file)
    return {"chunks": count}
