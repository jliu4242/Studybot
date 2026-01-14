import numpy as np
from fastapi import HTTPException
from openai import OpenAI

from ..core.config import get_settings
from ..core.db import notes_collection

settings = get_settings()
client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None


async def generate_questions_from_text(text: str) -> str:
    if client is None:
        raise HTTPException(status_code=500, detail="OpenAI API key is not configured.")
    if notes_collection is None:
        raise HTTPException(status_code=500, detail="Database is not configured.")

    embed = client.embeddings.create(model="text-embedding-3-large", input=text)
    vector = np.array(embed.data[0].embedding, dtype=float)
    norm = np.linalg.norm(vector) or 1e-12
    normalized_vector = vector / norm

    docs = await notes_collection.find({}).to_list(length=None)
    if not docs:
        raise HTTPException(status_code=404, detail="No notes have been uploaded yet.")

    scores = []
    for doc in docs:
        doc_vector = np.array(doc.get("embedding", []), dtype=float)
        scores.append(float(np.dot(normalized_vector, doc_vector)))

    best_index = int(np.argmax(scores))
    context_text = docs[best_index]["text"]

    prompt = f"""You are a helpful tutor that creates questions to help students learn.
    
    Rules:
    - base EVERY question strictly on the Notes below
    - generate exactly as many questions as the user asks for
    - make the questions look like test questions. Format them exactly the way an exam would
    - include the correct answer in a separate section below.

    Notes:
    \"\"\"{context_text}\"\"\"

    Questions:
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a tutor who creates test questions"},
            {"role": "user", "content": prompt},
        ],
    )

    return response.choices[0].message.content.strip()
