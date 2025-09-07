from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import os
import faiss
import numpy as np
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

db_client = AsyncIOMotorClient("mongodb+srv://jonliu4242:ciw1ijaxDDwIr1Kj@studybot-cluster.jphx4l9.mongodb.net/?retryWrites=true&w=majority&appName=studybot-cluster")
db = db_client.StudyBot

client = OpenAI(os.get("OPENAI_API_KEY"))

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

@app.post("/upload-notes/")
async def upload_notes(file: UploadFile = File(...)):
    chunks = split_text(file)
    
    # testing chunks
    for (String s : chunks) {
        console.log(s)
    }

    embeddings = []
    for chunk in chunks:
        response = client.embeddings.create(
            model='text-embedding-3-large',
            input = chunk
        )

        vector = np.array(response.data[0].embedding, dtype=float)
        console.log(vector)

        norm = np.linalg.norm(vector)
        normalized_vector = vector / norm
        console.log(normalized_vector)

        embeddings.append(normalized_vector)


        


@app.post("/generate-Questions/")
async def generate_questions(String msg):
    
