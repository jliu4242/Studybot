from docx import Document
from io import BytesIO
from fastapi import UploadFile

async def split_text(file: UploadFile):

    content = await file.read()
    file_like = BytesIO(content)

    doc = Document(file_like)

    chunks=[]
    current_chunk=''

    for para in doc.paragraphs:
        if para.style.name.startswith("Heading"):
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = para.text + "\n"
        else:
            current_chunk += para.text + "\n"
    
    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks
