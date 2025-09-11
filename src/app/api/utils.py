from docx import Document
from io import BytesIO
from fastapi import UploadFile
import mammoth 
from bs4 import BeautifulSoup

async def split_notes(file: UploadFile):

    parsed_html = await parse_docx(file)

    leaves = []
    path = []

    for node in parsed_html.find_all(["ul", "ol"], recursive=False):
        leaves.extend(await extract_leaves(node, path))

    return leaves

async def parse_docx(file: UploadFile):
    content = await file.read()

    result = mammoth.convert_to_html(content)
    html = result.value

    parsed_html = BeautifulSoup(html, 'html.parser')
    return parsed_html

async def extract_leaves(node, path=None):
    if path is None:
        path=[]
    leaves = []

    for li in node.find_all("li", recursive=False):
        text = li.get_text(strip=True)
        current_path = path + [text]

        indented_list = li.find(['ul', 'ol'], recursive=False)
        if indented_list:
            leaves.extend(extract_leaves(indented_list, current_path))
        else:
            leaves.append(" > ".join(current_path))

    for p in node.find_all('p', recursive=False):
        text = p.get_text(strip=True)

        if text:
            current_path = path + [text]
            leaves.append(" > ".join(current_path))

    return leaves