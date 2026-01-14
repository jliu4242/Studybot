import base64
from pathlib import Path
from typing import List

from fastapi import HTTPException, UploadFile
from openai import OpenAI

from ..core.config import get_settings
from .files import pdf_to_images

settings = get_settings()
client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None


async def extract_test_questions(image_paths: List[Path]) -> str:
    if client is None:
        raise HTTPException(status_code=500, detail="OpenAI API key is not configured.")

    parts: List[str] = []

    for path in sorted(image_paths):
        with open(path, "rb") as f:
            image_b64 = base64.b64encode(f.read()).decode("utf-8")

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "Extract all exam questions from the images. If the page is blank, just say nothing and skip it.",
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"},
                        }
                    ],
                },
            ],
        )

        content = response.choices[0].message.content.strip()
        if content:
            parts.append(content)

    return "\n".join(parts)


async def generate_exam_from_pdf(file: UploadFile) -> str:
    if client is None:
        raise HTTPException(status_code=500, detail="OpenAI API key is not configured.")

    image_paths = await pdf_to_images(file)
    if not image_paths:
        raise HTTPException(status_code=400, detail="No pages found in the uploaded PDF.")

    questions = await extract_test_questions(image_paths)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": """You are a professor creating an exam. Given questions from a previous exam, make exam-style questions of the same topic and similar difficulty.""",
            },
            {"role": "user", "content": f"Here are the questions:\n{questions}"},
        ],
    )

    return response.choices[0].message.content.strip()
