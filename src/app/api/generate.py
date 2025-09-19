from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import os
import numpy as np
from motor.motor_asyncio import AsyncIOMotorClient
from utils import split_notes, pdfToImages, storeNotes, extractTestQuestions

load_dotenv()

db_client = AsyncIOMotorClient(os.getenv("MONGODB"))
db = db_client["StudyBot"]
notes = db["notes"]

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hello"}

@app.post("/upload-notes")
async def upload_notes(file: UploadFile = File(...)):
    print('connected')
    chunks = await split_notes(file)


    for idx, chunk in enumerate(chunks):
        response = client.embeddings.create(
            model='text-embedding-3-large',
            input = chunk
        )

        vector = np.array(response.data[0].embedding, dtype=float)
        print(vector)

        norm = np.linalg.norm(vector)
        normalized_vector = vector / norm
        print(normalized_vector)

        notes.insert_one({
            "chunk_id": idx,
            "text": chunk,
            "embedding": normalized_vector.tolist()
        })
    
    print('finished')

@app.post("/generate-questions")
async def generate_questions(text: str = Body(...)):
    generateQuestions(text)
        
@app.post("/generate-test-questions")
async def generate_test_questions(file: UploadFile = File(...)):
    pdfToImages(file)
    questions = extractTestQuestions()
    
    response = client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages=[
            {'role': 'system', 'content': """You are a professor who is making an exam for you class. 
                                                Given questions from a previous exam, make questions of the same topic and similar difficulty"""},
            {'role': 'user', 'content': questions}
        ]
    )
    
    print(response.choices[0].message.content)



