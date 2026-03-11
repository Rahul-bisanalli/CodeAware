# 🧠 CodeAware — AI-Powered Code Learning Assistant

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
</p>

> **CodeAware** is a professional, IDE-like web platform that helps developers and students debug and understand code using Google Gemini AI. Write code, run it, and get intelligent, pedagogical feedback — all in one place.

---

## ✨ Features

- 🖥️ **Monaco Editor** — The same editor that powers VS Code, with syntax highlighting, bracket colorization, and smooth scrolling
- ▶️ **In-Browser Code Execution** — Run JavaScript directly and see real-time output in the built-in Debug Console
- 🤖 **Gemini AI Analysis** — Send your code + errors to Google Gemini for structured feedback:
  - 🔍 Analysis of the issue
  - 💡 Socratic hints to guide your thinking
  - 🛠️ A corrected code fix
  - 🎓 A learning moment explaining the underlying concept
- 🔄 **Dynamic AI Model Selection** — Choose between multiple Gemini models at runtime:
  - `Gemini 1.5 Flash` — Fast and stable
  - `Gemini 2.0 Flash` — Next-gen reasoning
  - `Gemini 1.5 Pro` — Deep architectural analysis
- 🐙 **GitHub Issues Search** — Relevant open-source GitHub issues are surfaced alongside AI feedback for real-world context
- 🎨 **Premium Dark UI** — Glassmorphism, smooth animations via Framer Motion, and an IDE-inspired sidebar navigation

---

## 🗂️ Project Structure

```
CodeAware/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── main.py           # API routes & FastAPI app setup
│   │   └── services/
│   │       ├── gemini_service.py   # Google Gemini AI integration
│   │       └── github_service.py  # GitHub issues search
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile
│   └── .env                  # Backend environment variables
│
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   └── index.css         # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── docker-compose.yml        # Docker orchestration
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.11+ | [python.org](https://www.python.org/downloads/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| npm | 9+ | Comes with Node.js |
| Git | Any | [git-scm.com](https://git-scm.com/) |

You will also need a **Google Gemini API Key**.  
👉 Get one free at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

---

### 🔧 Local Setup (Recommended)

#### 1. Clone the Repository

```bash
git clone https://github.com/Rahul-bisanalli/CodeAware.git
cd CodeAware
```

#### 2. Configure Environment Variables

The backend reads your Gemini API key from a `.env` file.

```bash
# In the backend directory
cd backend
```

Create a file named `.env` with the following content:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

#### 3. Run the Backend

```bash
# From the backend/ directory
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend API will be live at: **http://localhost:8000**  
Swagger docs available at: **http://localhost:8000/docs**

---

#### 4. Run the Frontend

Open a **new terminal** and run:

```bash
# From the frontend/ directory
cd ../frontend
npm install
npm run dev
```

The frontend will be live at: **http://localhost:5173** (or `5174` if the port is busy)

---

### 🐳 Docker Setup (Alternative)

If you prefer Docker, you can run both services with a single command.

Make sure Docker Desktop is running, then from the root of the project:

```bash
docker-compose up --build
```

| Service  | URL                       |
|----------|---------------------------|
| Frontend | http://localhost:5173     |
| Backend  | http://localhost:8000     |
| API Docs | http://localhost:8000/docs |

To stop:
```bash
docker-compose down
```

---

## 🛠️ API Reference

The backend exposes the following REST endpoints:

### `GET /`
Health check.
```json
{ "message": "Welcome to CodeAware API" }
```

### `GET /models`
Returns the list of available Gemini AI models.
```json
{
  "models": [
    { "id": "gemini-flash-latest", "name": "Gemini 1.5 Flash (Fast & Stable)", "description": "..." },
    ...
  ]
}
```

### `POST /analyze`
Analyzes code using the selected Gemini model.

**Request Body:**
```json
{
  "code": "function foo() { return a + b; }",
  "error": "ReferenceError: a is not defined",
  "model": "gemini-flash-latest"
}
```

**Response:**
```json
{
  "suggestion": "### 🔍 Analysis\n..."
}
```

### `GET /github-issues?query=<error>`
Searches GitHub for open-source issues related to the given error/query.

**Response:**
```json
[
  { "title": "ReferenceError in function scope", "url": "https://...", "repo": "owner/repo" }
]
```

---

## 🧪 How to Use CodeAware

1. **Open** the app at `http://localhost:5173`
2. **Write or paste** your JavaScript code in the Monaco editor
3. Click **▶ Run** to execute the code and see output in the Debug Console
4. If there's an error, click **🤖 Analyze & Debug**
5. Choose your preferred **Gemini model** from the dropdown
6. View the structured AI response with hints, fixes, and learning notes
7. Browse related **GitHub Issues** surfaced alongside the AI output

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Your Google Gemini API key |

---

## 📦 Tech Stack

### Frontend
| Library | Purpose |
|---------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| Monaco Editor | Code editor (`@monaco-editor/react`) |
| Framer Motion | Animations |
| React Markdown | Render AI responses as Markdown |
| Lucide React | Icons |

### Backend
| Library | Purpose |
|---------|---------|
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| Google Generative AI | Gemini API client |
| Pydantic | Data validation |
| python-dotenv | Environment variable loading |
| httpx | HTTP client for GitHub API |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request on GitHub

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built with ❤️ by [Rahul Bisanalli](https://github.com/Rahul-bisanalli)

---

<p align="center">⭐ Star this repo if you found it helpful!</p>
