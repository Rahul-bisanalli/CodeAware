import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { Bot, Terminal, Github, Sparkles, Play, Loader2, RotateCcw, Settings, Code, FileCode, History, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [code, setCode] = useState(`// Welcome to CodeAware\n// Try defining a function with a bug!\n\nfunction calculateSum(a, b) {\n  return a + b; // Change this to return a + c to see AI in action\n}\n\nconsole.log(calculateSum(5, 10));`);
  const [logs, setLogs] = useState([]);
  const [aiResponse, setAiResponse] = useState('');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('gemini-flash-latest');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('http://localhost:8000/models');
        const data = await res.json();
        // Defensive check: ensure we set an array
        const modelList = Array.isArray(data.models) ? data.models : [];
        setModels(modelList);
      } catch (err) {
        console.error("Failed to fetch models", err);
        setModels([]); // Fallback to empty array on error
      }
    };
    fetchModels();
  }, []);

  const runCode = () => {
    setIsRunning(true);
    setLogs([]);
    const capturedLogs = [];

    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      capturedLogs.push({ type: 'log', content: args.map(a => String(a)).join(' ') });
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      capturedLogs.push({ type: 'error', content: args.map(a => String(a)).join(' ') });
      originalError.apply(console, args);
    };

    try {
      eval(code);
    } catch (err) {
      capturedLogs.push({ type: 'error', content: `${err.name}: ${err.message}` });
    }

    console.log = originalLog;
    console.error = originalError;

    setLogs(capturedLogs);
    setIsRunning(false);
  };

  const analyzeCode = async () => {
    setLoading(true);
    setAiResponse("");
    const lastError = [...logs].reverse().find(o => o.type === 'error')?.content || "";

    try {
      const res = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, error: lastError, model: selectedModel })
      });
      const data = await res.json();
      setAiResponse(data.suggestion || "AI generated an empty response.");

      const githubRes = await fetch(`http://localhost:8000/github-issues?query=${encodeURIComponent(lastError || "javascript error")}`);
      const githubData = await githubRes.json();
      setIssues(githubData);
    } catch (err) {
      setAiResponse("### ⚠️ Connection Error\nCould not reach CodeAware AI. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <nav className="sidebar-nav">
        <div className="nav-item active">
          <Code size={24} />
        </div>
        <div className="nav-item">
          <FileCode size={22} />
        </div>
        <div className="nav-item">
          <History size={22} />
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item">
            <Settings size={22} />
          </div>
        </div>
      </nav>

      <div className="editor-section">
        <header>
          <div className="logo">
            <Sparkles size={24} />
            CodeAware
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <select 
              className="model-selector"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              title="Select AI Model"
            >
              {models.map(m => (
                <option key={m.id} value={m.id} title={m.description}>
                  {m.name}
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: 12 }}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary" 
                onClick={runCode} 
                disabled={isRunning}
              >
                <Play size={16} fill="currentColor" /> Run
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary" 
                onClick={analyzeCode} 
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Bot size={18} />}
                {loading ? "Analyzing..." : "Analyze & Debug"}
              </motion.button>
            </div>
          </div>
        </header>

        <main className="editor-container">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={value => setCode(value)}
            options={{
              fontSize: 15,
              fontFamily: "'Fira Code', monospace",
              minimap: { enabled: false },
              padding: { top: 24 },
              smoothScrolling: true,
              cursorSmoothCaretAnimation: "on",
              lineNumbersMinChars: 4,
              bracketPairColorization: { enabled: true },
              scrollBeyondLastLine: false,
              lineHeight: 24,
            }}
          />
        </main>

        <div className="terminal-area">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--accent-primary)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>
              <Terminal size={16} /> DEBUG CONSOLE
            </div>
            <button className="icon-btn" style={{ padding: 4 }} onClick={() => setLogs([])}>
              <RotateCcw size={14} />
            </button>
          </div>
          <div className="terminal-content">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`log-line ${log.type}`}
                >
                  <span className="prompt">❯</span>
                  {log.content}
                </motion.div>
              ))
            ) : (
              <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', fontSize: '13px' }}>
                System ready. Run code to see execution results.
              </div>
            )}
          </div>
        </div>
      </div>

      <aside className="ai-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{ padding: 10, background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', borderRadius: 12 }}>
            <Bot size={24} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.01em' }}>Learning Assistant</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {models.find(m => m.id === selectedModel)?.name}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {aiResponse ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="ai-message"
            >
              <ReactMarkdown>{aiResponse}</ReactMarkdown>
            </motion.div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: 40, padding: '0 20px' }}>
              Select a model and hit **Analyze** for personalized insights.
            </div>
          )}
        </AnimatePresence>

        {issues.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              <Github size={18} /> OPEN SOURCE EXAMPLES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {issues.map((issue, i) => (
                <motion.a
                  key={i}
                  href={issue.url}
                  target="_blank"
                  rel="noreferrer"
                  className="github-issue"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="repo">{issue.repo}</div>
                    <ExternalLink size={12} style={{ opacity: 0.5 }} />
                  </div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-main)' }}>{issue.title}</div>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default App;
