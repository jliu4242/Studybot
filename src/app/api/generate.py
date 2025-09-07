from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from OpenAI import openai

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
    const text = doc_to_text(file)
    const chunks = split_text(text)

@app.post("/generate-Questions/")
async def generate_questions(String msg):
    
