import logging
import numpy as np
from fastapi import HTTPException
from openai import OpenAI

from ..core.config import get_settings
from ..core.db import notes_collection

settings = get_settings()
logger = logging.getLogger(__name__)
client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None


async def generate_questions_from_text(text: str, numQuestions: int) -> str:
    if client is None:
        raise HTTPException(status_code=500, detail="OpenAI API key is not configured.")
    if notes_collection is None:
        raise HTTPException(status_code=500, detail="Database is not configured.")

    try:
        embed = client.embeddings.create(model="text-embedding-3-large", input=text)
        vector = np.array(embed.data[0].embedding, dtype=float)
        norm = np.linalg.norm(vector) or 1e-12
        normalized_vector = vector / norm
    except Exception as exc:
        logger.exception("Failed to create embedding for generate request.")
        raise HTTPException(status_code=500, detail="Failed to embed prompt text.") from exc

    try:
        # Only fetch the fields we need and cap the number of documents to keep latency low.
        docs = await notes_collection.find({}, {"text": 1, "embedding": 1}).to_list(length=20)
    except Exception as exc:
        logger.exception("Failed to fetch notes from database.")
        raise HTTPException(status_code=500, detail="Database error when fetching notes.") from exc

    if not docs:
        raise HTTPException(status_code=404, detail="No notes have been uploaded yet.")

    # Vectorize dot products to score faster.
    embeddings = []
    texts = []
    for doc in docs:
        doc_vector = np.array(doc.get("embedding", []), dtype=float)
        if doc_vector.size == 0:
            continue
        embeddings.append(doc_vector)
        texts.append(doc.get("text", ""))

    if not embeddings:
        raise HTTPException(status_code=404, detail="No valid embeddings found for notes.")

    matrix = np.vstack(embeddings)
    scores = matrix.dot(normalized_vector)
    scored_docs = list(zip(scores, texts))

    scored_docs.sort(key=lambda x: x[0], reverse=True)
    top_k = min(15, len(scored_docs))
    top_texts = [text for _, text in scored_docs[:top_k]]
    context_text = "\n\n---\n\n".join(top_texts)

    prompt = f"""You are a helpful tutor that creates rigorous, exam-style multiple-choice questions.

    Rules (follow this exact structure so questions and explanations are easy to parse):
    - base every question stem and the correct answer strictly on the Notes below; do not invent new facts for the stem or correct answer.
    - incorrect options may use general background knowledge, but must be concrete, plausible, and clearly wrong per the notes; keep them the same type of entity as the correct answer (e.g., named diamonds vs. vague categories). Never use list titles, categories, or partial phrases as options.
    - generate exactly {numQuestions} questions, each with four options labeled A) through D).
    - each option must be a complete, grammatical statement and mutually exclusive from the others.
    - for each option, put the explanation on the SAME line after a hyphen, grounded in the notes, explaining why it is correct or incorrect.
    - for each question, include the correct answer on its own line as: Correct Answer: <letter> - <brief note from the source>.
    - separate questions with a blank line. Do not add any other sections or commentary.
    - if Notes are non-empty, you MUST generate questions; NEVER respond with "Unable to generate question from notes."

    Output format for each question (copy exactly):
    Q<Number>. <question text>
    A) <option text> - <why correct/incorrect from notes>
    B) <option text> - <why correct/incorrect from notes>
    C) <option text> - <why correct/incorrect from notes>
    D) <option text> - <why correct/incorrect from notes>
    Correct Answer: <letter> - <brief note from the source>

    Notes:
    \"\"\"{context_text}\"\"\"

    Questions:
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a meticulous tutor who writes exam-style multiple-choice "
                        "questions in a strict, machine-parseable format. Use only the provided "
                        "notes; do not add new facts or speculation. If notes are present, you "
                        "must produce questions. Follow the requested structure exactly."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
        )
        print(response.choices[0].message.content.strip())
    except Exception as exc:
        logger.exception("LLM generation failed.")
        raise HTTPException(status_code=500, detail="Failed to generate questions with the language model.") from exc

    return response.choices[0].message.content.strip()
