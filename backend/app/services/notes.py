from typing import Optional

import numpy as np
from fastapi import HTTPException, UploadFile
from openai import OpenAI
import logging

from ..core.config import get_settings
from ..core.db import notes_collection
from .files import split_notes

settings = get_settings()
logger = logging.getLogger(__name__)
client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None


async def ingest_notes(file: UploadFile) -> int:
    if client is None:
        raise HTTPException(status_code=500, detail="OpenAI API key is not configured.")
    if notes_collection is None:
        raise HTTPException(status_code=500, detail="Database is not configured.")

    logger.info("Ingest start: filename=%s", file.filename)
    chunks = await split_notes(file)
    logger.info("Chunks ready: filename=%s chunks=%s", file.filename, len(chunks))

    if not chunks:
        raise HTTPException(status_code=400, detail="No content found in uploaded file.")

    try:
        embeddings = client.embeddings.create(model="text-embedding-3-large", input=chunks)
    except Exception as exc:
        logger.exception("Failed to embed chunks for file %s", file.filename)
        raise HTTPException(status_code=500, detail="Failed to embed notes. Check server logs.") from exc

    try:
        docs = []
        for idx, data in enumerate(embeddings.data):
            vector = np.array(data.embedding, dtype=float)
            norm = np.linalg.norm(vector) or 1e-12
            normalized_vector = vector / norm
            docs.append(
                {
                    "chunk_id": idx,
                    "text": chunks[idx],
                    "embedding": normalized_vector.tolist(),
                }
            )

        if docs:
            await notes_collection.insert_many(docs)
    except Exception as exc:
        logger.exception("Failed to insert embedded chunks for file %s", file.filename)
        raise HTTPException(status_code=500, detail="Failed to store embedded notes.") from exc

    return len(chunks)
