# Task Manager Application

## Brief Description

This project is a full-stack Task Manager application built as part of the Studio Graphene take-home exercise. The application allows users to create, edit, delete, and manage tasks through a responsive React frontend and a Node.js/Express backend. Tasks can be filtered by status (All, Active, Completed, and Overdue), and overdue tasks are automatically identified based on their due dates.

---

## Features

* Create new tasks
* Edit existing tasks
* Delete tasks with confirmation modal
* Mark tasks as completed
* Automatically detect overdue tasks
* Filter tasks by status
* Sort and view tasks using AG Grid
* Search and filter tasks using AG Grid
* Persistent storage using SQLite
* RESTful API architecture

---

## Tech Stack

### Frontend

* React 19
* Vite
* AG Grid
* Axios
* Bootstrap
* React Bootstrap
* Tailwind CSS

### Backend

* Node.js
* Express.js
* Better SQLite3
* CORS

### Storage

* SQLite Database

---

## Project Structure

```text
task-manager/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── tasks.db
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## How to Run Locally

### Prerequisites

* Node.js (v18 or later recommended)
* npm

### Clone Repository

```bash
git clone <https://github.com/parth-agwal/task-manager.git>
cd task-manager
```

### Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend runs on:

```text
http://localhost:8000
```

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## API Documentation

### Get All Tasks

```http
GET /tasks
```

Response:

```json
[
  {
    "id": 1,
    "title": "Sample Task",
    "description": "Task Description",
    "dueDate": "2026-08-01",
    "status": "Active",
    "createdOn": "2026-08-01"
  }
]
```

---

### Create Task

```http
POST /tasks
```

Request Body:

```json
{
  "title": "New Task",
  "description": "Task Description",
  "dueDate": "2026-08-01"
}
```

Response:

```json
{
  "message": "Task Added"
}
```

---

### Update Task

```http
PUT /tasks/:id
```

Request Body:

```json
{
  "title": "Updated Task",
  "description": "Updated Description",
  "dueDate": "2026-08-15"
}
```

Response:

```json
{
  "message": "Task Updated"
}
```

---

### Toggle Task Status

```http
PUT /tasks/status/:id
```

Response:

```json
{
  "message": "Status Updated"
}
```

---

### Delete Task

```http
DELETE /tasks/:id
```

Response:

```json
{
  "success": true
}
```

---

## Design Decisions

* SQLite was chosen because it provides lightweight persistent storage without requiring additional database setup.
* AG Grid was used to provide efficient task listing, sorting, and filtering capabilities.
* Express.js was used to keep the backend simple and maintainable.
* React functional components and hooks were used throughout the frontend.

---

## Future Improvements

Given more time, the following enhancements would be implemented:
* Add category column(College, Home, Office).
* Drag-and-drop task reordering.
* Task priority levels (Low, Medium, High).
* Due date reminders and notifications.
* Server side sorting and pagination.
* Migration from SQLite to PostgreSQL for improved scalability in production environments.

---

## Live Demo

Frontend:
https://task-manager-frontend-2h66.onrender.com/

Backend API:
https://task-manager-backend-t57l.onrender.com/tasks


---

## Author

Parth Agwal
