from io import BytesIO
from pathlib import Path
from typing import List

import logging
import mammoth
from bs4 import BeautifulSoup
import fitz
from fastapi import HTTPException, UploadFile
from pdf2image import convert_from_bytes

BASE_DIR = Path(__file__).resolve().parent.parent
PAGES_DIR = BASE_DIR / "pages"
logger = logging.getLogger(__name__)


def parse_docx_bytes(content: bytes):
    parsed_content = BytesIO(content)
    result = mammoth.convert_to_html(parsed_content)
    return BeautifulSoup(result.value, "html.parser")


def extract_leaves(node, path=None):
    if path is None:
        path = []
    leaves = []

    for li in node.find_all("li", recursive=False):
        text = li.get_text(strip=True)
        current_path = path + [text]

        indented_list = li.find(["ul", "ol"], recursive=False)
        if indented_list:
            leaves.extend(extract_leaves(indented_list, current_path))
        else:
            leaves.append(" > ".join(current_path))

    for p in node.find_all("p", recursive=False):
        text = p.get_text(strip=True)
        if text:
            current_path = path + [text]
            leaves.append(" > ".join(current_path))

    return leaves


async def split_notes(file: UploadFile) -> List[str]:
    content = await file.read()
    filename = (file.filename or "").lower()

    if filename.endswith(".docx"):
        logger.info("Parsing DOCX: %s", file.filename)
        parsed_html = parse_docx_bytes(content)

        leaves: List[str] = []
        path: List[str] = []

        for node in parsed_html.find_all(["p", "ul", "ol"], recursive=False):
            leaves.extend(extract_leaves(node, path))

        logger.info("Extracted %s leaves from DOCX: %s", len(leaves), file.filename)
        return leaves

    if filename.endswith(".pdf"):
        logger.info("Parsing PDF: %s", file.filename)
        doc = fitz.open(stream=content, filetype="pdf")
        pages = []
        for page in doc:
            text = page.get_text("text").strip()
            if text:
                pages.append(text)
        logger.info("Extracted %s pages from PDF: %s", len(pages), file.filename)
        return pages

    if filename.endswith(".txt"):
        logger.info("Parsing TXT: %s", file.filename)
        text = content.decode("utf-8", errors="ignore")
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        logger.info("Extracted %s paragraphs from TXT: %s", len(paragraphs), file.filename)
        return paragraphs

    raise HTTPException(status_code=400, detail="Unsupported file type. Upload DOCX, PDF, or TXT.")


async def pdf_to_images(file: UploadFile) -> List[Path]:
    content = await file.read()
    images = convert_from_bytes(content, dpi=200)

    PAGES_DIR.mkdir(exist_ok=True)
    saved_paths: List[Path] = []
    stem = Path(file.filename or "exam").stem

    for idx, image in enumerate(images):
        path = PAGES_DIR / f"{stem}_{idx}.jpg"
        image.save(path, "JPEG")
        saved_paths.append(path)

    return saved_paths
