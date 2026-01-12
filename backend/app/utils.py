import base64
from io import BytesIO
import os
from pathlib import Path

import mammoth 
import numpy as np
from bs4 import BeautifulSoup
from docx import Document
from dotenv import load_dotenv
from fastapi import UploadFile, Body
from motor.motor_asyncio import AsyncIOMotorClient
from openai import OpenAI
from pdf2image import convert_from_path

BASE_DIR = Path(__file__).resolve().parent
PAGES_DIR = BASE_DIR / "pages"

load_dotenv(BASE_DIR / ".env")

db_client = AsyncIOMotorClient(os.getenv("MONGODB"))
db = db_client["StudyBot"]
notes = db["notes"]

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def split_notes(file: UploadFile):

    parsed_html = await parse_docx(file)

    leaves = []
    path = []

    for node in parsed_html.find_all(['p', "ul", "ol"], recursive=False):
        leaves.extend(extract_leaves(node, path))

    return leaves

async def parse_docx(file: UploadFile):
    content = await file.read()
    parsed_content = BytesIO(content)

    result = mammoth.convert_to_html(parsed_content)
    html = result.value

    parsed_html = BeautifulSoup(html, 'html.parser')
    return parsed_html

def extract_leaves(node, path=None):
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

def pdfToImages(file: UploadFile):
    PAGES_DIR.mkdir(exist_ok=True)
    images = convert_from_path(BASE_DIR / '221_2007WT2_sec201.pdf', dpi=200)
    print("images converted")
    for i in range(len(images)):
        images[i].save(PAGES_DIR / f'math{i}.jpg', 'JPEG')

def extractTestQuestions():
    images = sorted(PAGES_DIR.glob("*.jpg"))
    
    message = """"""
    
    for idx, example in enumerate(images):
        with open(example, "rb") as f:
            image_b64 = base64.b64encode(f.read()).decode('utf-8')
        
        response = client.chat.completions.create(
            model = 'gpt-4o',
            messages = [
                {"role": "system", "content": "Extract all exam questions from the images. If the page is blank, just say nothing and skip it."},
                {"role": "user", 
                "content": [
                    {
                        "type": "image_url", 
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_b64}"
                        }
                    },                            
                ],
                },
            ]
        )
        
        print (response.choices[0].message.content.strip())
        message += response.choices[0].message.content.strip()
    
    return message
   
async def generateQuestions(text: str = Body(...)):        
    embed = client.embeddings.create(
        model='text-embedding-3-large',
        input=text
    )

    vector = np.array(embed.data[0].embedding, dtype=float)
    print(vector)
    
    norm = np.linalg.norm(vector)
    normalized_vector = vector / norm
    print(normalized_vector)

    docs = await notes.find({}).to_list(length=None)
    vectors = [doc["embedding"] for doc in docs]

    scores = []
    # Calculating cosine similarity
    for vector in vectors:
        normalized_vector, vector = np.array(normalized_vector), np.array(vector)
        res = np.dot(normalized_vector, vector)
        scores.append(res)

    best_index = np.argmax(scores)
    best_index = int(best_index)
    
    doc1 = docs[best_index]
    context_text = doc1["text"]
    print(context_text)

    prompt = f""" You are a helpful tutor that creates questions to help students learn.
        
        Rules:
        - base EVERY question strictly on the Notees below
        - generate exactly as many questions as the user asks for
        - make the questions look like test questions. Format them exactly the way an exam would
        - include the correct answer in a seperate section below.

        Notes:
        \"\"\"{context_text}\"\"\"

        Questions:
        """

    response = client.chat.completions.create(
        model='gpt-3.5-turbo',
        messages=[
            {'role': 'system', 'content': 'You are a tutor who creates test questions'},
            {'role': 'user', 'content': prompt}
        ]
    )

    print (response.choices[0].message.content)
    return response.choices[0].message.content
