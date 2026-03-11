# CodeAware

An AI-powered code debugging assistant built with React, FastAPI, and Google Gemini.

---

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Python 3.11+](https://www.python.org/)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Rahul-bisanalli/CodeAware.git
cd CodeAware
```

### 2. Set Up Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Run the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

> Backend runs at **http://localhost:8000**

### 4. Run the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs at **http://localhost:5173**

---

## Docker (Optional)

```bash
docker-compose up --build
```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:8000 |

---

## Built With

- **Frontend** — React, Vite, Monaco Editor, Framer Motion
- **Backend** — FastAPI, Python, Google Gemini AI

---

> Made by [Rahul Bisanalli](https://github.com/Rahul-bisanalli)
