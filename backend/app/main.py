from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import notes, questions, exams, saved

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes.router)
app.include_router(questions.router)
app.include_router(exams.router)
app.include_router(saved.router)


@app.get("/")
def root():
    return {"message": "Hello"}
