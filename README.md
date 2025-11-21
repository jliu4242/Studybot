# StudyBot
AI-powered question generator from notes and past exams.

## Overview
StudyBot is an intelligent study assistant that transforms your **notes** and **exam files** into relevant, high-quality practice questions.

- **Notes Mode:** Generates questions only from the uploaded notes.
- **Exam Mode:** Generates new questions that match the *style, difficulty, and concepts* of your past exams.
- No hallucinated or irrelevant topics — all questions come strictly from your content.

## Features

### Smart Question Generation
- Concept-preserving question generation.
- Exam-style mimicry.
- Strictly grounded in the provided files.

### File Upload System
- Upload notes, PDFs, or exam files.
- Automatic text extraction and preprocessing.

### Modern UI
- Built with **Next.js**.
- Clean UX for uploading files and previewing generated question sets.

### Backend Intelligence
- **FastAPI** backend handles parsing, LLM calls, and generation logic.
- Modular design for future improvemen

### Database Integration
- **MongoDB** stores extracted text, generated questions, and metadata.

### Authentication (Planned)
- Auth0 integration coming soon.

## Tech Stack

### Frontend
- Next.js  
- React  
- TailwindCSS (optional)

### Backend
- FastAPI (Python)  
- Document parser  
- LLM-based question generator

### Database
- MongoDB

### Authentication (Coming Soon)
- Auth0 for login and user profiles