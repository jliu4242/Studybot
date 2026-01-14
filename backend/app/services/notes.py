from typing import Optional

import numpy as np
from fastapi import HTTPException, UploadFile
from openai import OpenAI

from ..core.config import get_settings
from ..core.db import notes_collection
from .files import split_notes

settings = get_settings()
client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None


async def ingest_notes(file: UploadFile) -> int:
    if client is None:
        raise HTTPException(status_code=500, detail="OpenAI API key is not configured.")
    if notes_collection is None:
        raise HTTPException(status_code=500, detail="Database is not configured.")

    chunks = await split_notes(file)

    for idx, chunk in enumerate(chunks):
        response = client.embeddings.create(model="text-embedding-3-large", input=chunk)
        vector = np.array(response.data[0].embedding, dtype=float)
        norm = np.linalg.norm(vector) or 1e-12
        normalized_vector = vector / norm

        await notes_collection.insert_one(
            {
                "chunk_id": idx,
                "text": chunk,
                "embedding": normalized_vector.tolist(),
            }
        )

    return len(chunks)
