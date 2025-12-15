# Task Tracker – Flask Application

This is a simple full-stack Task Tracker application developed as part of a coding test.

## Features
- Add new tasks
- Mark tasks as completed
- Delete tasks
- Tasks persist across page refresh (backend-based)
- REST API based communication

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Python (Flask)

## API Endpoints
- GET /tasks → Fetch all tasks
- POST /tasks → Add a new task
- PUT /tasks/<id> → Toggle task completion
- DELETE /tasks/<id> → Delete a task

## How to Run Locally
```bash
python -m pip install -r requirements.txt
python app.py
