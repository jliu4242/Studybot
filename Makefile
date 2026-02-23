PYTHON ?= python
UVICORN ?= uvicorn
APP_MODULE := app.main:app
APP_DIR := backend
HOST ?= 0.0.0.0
PORT ?= 8000
VENV ?= .venv

# Choose activation command based on platform.
ifeq ($(OS),Windows_NT)
VENVSHELL := powershell -NoExit -ExecutionPolicy Bypass -File "$(VENV)/Scripts/Activate.ps1"
ACTIVATE_PATH := $(VENV)/Scripts/Activate.ps1
VENV_PY ?= python
else
VENVSHELL := bash -c "source \"$(VENV)/bin/activate\" && exec bash"
ACTIVATE_PATH := $(VENV)/bin/activate
VENV_PY ?= python3
endif

.PHONY: backend backend-run backend-install venv-shell venv-create

backend: backend-run

start-venv:
	venv\Scripts\activate.bat

run:
	uvicorn app.main:app --app-dir backend --reload --host 0.0.0.0 --port 8000
