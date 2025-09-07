from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import os
import numpy as np
from motor.motor_asyncio import AsyncIOMotorClient
from utils import split_text

load_dotenv()

db_client = AsyncIOMotorClient(os.getenv("MONGODB"))
db = db_client.StudyBot
notes = db.notes

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
    chunks = await split_text(file)
    
    # testing chunks
    for s in chunks :
        print(s)


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
    
