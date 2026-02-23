import logging
from fastapi import APIRouter, File, HTTPException, UploadFile, Response

from ...services.notes import ingest_notes
from ...core.db import notes_collection

router = APIRouter(prefix="/notes", tags=["notes"])
logger = logging.getLogger(__name__)


@router.post("/upload")
async def upload_notes(file: UploadFile = File(...)):
    try:
        logger.info("Received notes upload: filename=%s content_type=%s", file.filename, file.content_type)
        count = await ingest_notes(file)
        logger.info("Ingested notes: filename=%s chunks=%s", file.filename, count)
        return {"chunks": count}
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to ingest notes: filename=%s", file.filename)
        raise HTTPException(status_code=500, detail="Failed to process notes file.") from exc


@router.post("/clear", status_code=204)
async def clear_notes():
    if notes_collection is None:
        raise HTTPException(status_code=500, detail="Database is not configured.")

    try:
        await notes_collection.delete_many({})
    except Exception as exc:
        logger.exception("Failed to cleanup notes embeddings.")
        raise HTTPException(status_code=500, detail="Failed to clear notes data.") from exc

    return Response(status_code=204)
