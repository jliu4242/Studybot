PYTHON ?= python
UVICORN ?= uvicorn
APP_MODULE := app.main:app
APP_DIR := backend
HOST ?= 0.0.0.0
PORT ?= 8000
VENV ?= .venv

.PHONY: backend backend-run backend-install venv-shell venv-create

backend: backend-run

start-venv:
	venv\Scripts\activate.bat

run:
	uvicorn app.main:app --app-dir backend --reload --host 0.0.0.0 --port 8000
