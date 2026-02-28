from datetime import datetime
from typing import Dict, List, Optional

from fastapi import HTTPException, status

from ..core.db import saved_questions_collection


def _serialize(doc: Dict) -> Dict:
    return {
        "id": str(doc.get("_id") or ""),
        "question": doc.get("question", ""),
        "mode": doc.get("mode", ""),
        "source": doc.get("source") or "",
        "created_at": doc.get("created_at"),
    }


async def save_question_for_user(
    user_id: str, question: str, mode: str, source: Optional[str] = None
) -> Dict:
    if saved_questions_collection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database is not configured.",
        )

    doc = {
        "user_id": user_id,
        "question": question,
        "mode": mode,
        "source": source,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    try:
        result = await saved_questions_collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return _serialize(doc)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save question.",
        ) from exc


async def list_saved_questions_for_user(user_id: str) -> List[Dict]:
    if saved_questions_collection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database is not configured.",
        )

    try:
        cursor = (
            saved_questions_collection.find({"user_id": user_id})
            .sort("created_at", -1)
        )
        docs = await cursor.to_list(length=200)
        return [_serialize(doc) for doc in docs]
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch saved questions.",
        ) from exc
