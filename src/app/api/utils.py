from docx import Document

def split_text(file):
    doc = Document(file)

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
