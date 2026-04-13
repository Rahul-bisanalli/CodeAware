import { useEffect, useMemo, useState } from 'react';
import { AiAssistantPanel } from './components/AiAssistantPanel';
import { CodeEditor } from './components/CodeEditor';
import { CommandPalette } from './components/CommandPalette';
import { Sidebar } from './components/Sidebar';
import { TerminalPanel } from './components/TerminalPanel';
import { TopBar } from './components/TopBar';
import { WorkspacePanel } from './components/WorkspacePanel';
import { api } from './lib/api';
import { cn } from './lib/cn';
import { formatJavaScript, runJavaScriptInWorker } from './lib/runner';
import { createId, readStoredValue, writeStoredValue } from './lib/storage';

const starterCode = `// Welcome to CodeAware
// Try defining a function with a bug.

function calculateSum(a, b) {
  return a + b; // Change this to return a + c to see AI in action
}

console.log(calculateSum(5, 10));`;

const defaultFile = {
  id: 'file-main',
  name: 'main.js',
  language: 'javascript',
  code: starterCode,
  updatedAt: new Date().toISOString(),
};

const defaultSettings = {
  aiWidth: 420,
  autoSave: true,
  fontSize: 15,
  minimap: false,
  terminalHeight: 256,
  wordWrap: 'off',
};

function App() {
  const [files, setFiles] = useState(() => readStoredValue('codeaware-files', [defaultFile]));
  const [activeFileId, setActiveFileId] = useState(
    () => localStorage.getItem('codeaware-active-file') || 'file-main',
  );
  const [logs, setLogs] = useState([]);
  const [aiResponse, setAiResponse] = useState(() => localStorage.getItem('codeaware-ai-response') || '');
  const [issues, setIssues] = useState([]);
  const [history, setHistory] = useState(() => readStoredValue('codeaware-history', []));
  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...readStoredValue('codeaware-settings', {}),
  }));
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [models, setModels] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [selectedModel, setSelectedModel] = useState(
    () => localStorage.getItem('codeaware-model') || 'gemini-flash-latest',
  );
  const [activeView, setActiveView] = useState('editor');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('codeaware-theme') || 'dark');
  const [sidebarDock, setSidebarDock] = useState(
    () => localStorage.getItem('codeaware-sidebar-dock') || 'left',
  );

  const activeFile = useMemo(
    () => files.find((file) => file.id === activeFileId) || files[0] || defaultFile,
    [activeFileId, files],
  );

  const selectedModelName = useMemo(
    () => models.find((model) => model.id === selectedModel)?.name,
    [models, selectedModel],
  );

  useEffect(() => {
    if (!files.some((file) => file.id === activeFileId) && files[0]) {
      setActiveFileId(files[0].id);
    }
  }, [activeFileId, files]);

  useEffect(() => {
    writeStoredValue('codeaware-files', files);
  }, [files]);

  useEffect(() => {
    writeStoredValue('codeaware-history', history.slice(0, 50));
  }, [history]);

  useEffect(() => {
    writeStoredValue('codeaware-settings', settings);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('codeaware-active-file', activeFile.id);
  }, [activeFile.id]);

  useEffect(() => {
    localStorage.setItem('codeaware-ai-response', aiResponse);
  }, [aiResponse]);

  useEffect(() => {
    localStorage.setItem('codeaware-model', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('codeaware-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('codeaware-sidebar-dock', sidebarDock);
  }, [sidebarDock]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }

      if (event.key === 'Escape') {
        setPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        await api.health();
        setBackendStatus('connected');
        const data = await api.getModels();
        setModels(Array.isArray(data.models) ? data.models : []);
      } catch (error) {
        console.error('Failed to fetch models', error);
        setBackendStatus('offline');
        setModels([]);
      }
    };

    fetchModels();
  }, []);

  const updateActiveFile = (updates) => {
    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.id === activeFile.id ? { ...file, ...updates, updatedAt: new Date().toISOString() } : file,
      ),
    );
  };

  const updateCode = (nextCode) => {
    updateActiveFile({ code: nextCode });
  };

  const addHistoryItem = (item) => {
    setHistory((currentHistory) => [
      {
        id: createId('history'),
        code: activeFile.code,
        createdAt: new Date().toISOString(),
        fileName: activeFile.name,
        language: activeFile.language,
        ...item,
      },
      ...currentHistory,
    ].slice(0, 50));
  };

  const runCode = async () => {
    setIsRunning(true);
    setLogs([]);

    if (activeFile.language !== 'javascript') {
      const unsupportedLogs = [
        { type: 'error', content: `Runner currently supports JavaScript files. ${activeFile.name} is ${activeFile.language}.` },
      ];
      setLogs(unsupportedLogs);
      addHistoryItem({ logs: unsupportedLogs, summary: unsupportedLogs[0].content, type: 'run' });
      setIsRunning(false);
      return;
    }

    const capturedLogs = await runJavaScriptInWorker(activeFile.code);
    setLogs(capturedLogs);
    addHistoryItem({
      logs: capturedLogs,
      summary: capturedLogs.find((log) => log.type === 'error')?.content || `${capturedLogs.length || 0} console event(s)`,
      type: 'run',
    });
    setIsRunning(false);
  };

  const analyzeCode = async (instruction = '') => {
    setLoading(true);
    setAiResponse('');
    const lastError = [...logs].reverse().find((log) => log.type === 'error')?.content || '';

    try {
      const data = await api.analyzeCode({
        code: activeFile.code,
        error: lastError,
        instruction,
        model: selectedModel,
      });
      const suggestion = data.suggestion || 'AI generated an empty response.';
      setAiResponse(suggestion);

      const issueData = await api.getGithubIssues(lastError || 'javascript error');
      setIssues(Array.isArray(issueData) ? issueData : []);
      addHistoryItem({
        aiResponse: suggestion,
        summary: instruction || suggestion.replace(/\s+/g, ' ').slice(0, 140),
        type: 'analysis',
      });
    } catch (error) {
      console.error('Failed to analyze code', error);
      const message = '### Connection Error\nCould not reach CodeAware AI. Is the backend running?';
      setAiResponse(message);
      addHistoryItem({ aiResponse: message, summary: 'AI connection failed', type: 'analysis' });
    } finally {
      setLoading(false);
    }
  };

  const createFile = () => {
    const fileNumber = files.length + 1;
    const newFile = {
      id: createId('file'),
      name: `scratch-${fileNumber}.js`,
      language: 'javascript',
      code: 'console.log("New file ready");',
      updatedAt: new Date().toISOString(),
    };

    setFiles((currentFiles) => [...currentFiles, newFile]);
    setActiveFileId(newFile.id);
    setActiveView('editor');
  };

  const duplicateFile = () => {
    const newFile = {
      ...activeFile,
      id: createId('file'),
      name: activeFile.name.replace(/(\.[^.]+)?$/, ' copy$1'),
      updatedAt: new Date().toISOString(),
    };

    setFiles((currentFiles) => [...currentFiles, newFile]);
    setActiveFileId(newFile.id);
    setActiveView('editor');
  };

  const deleteFile = (fileId) => {
    if (files.length <= 1) {
      return;
    }

    setFiles((currentFiles) => currentFiles.filter((file) => file.id !== fileId));
  };

  const renameFile = (fileId) => {
    const file = files.find((item) => item.id === fileId);
    const nextName = window.prompt('Rename file', file?.name || '');

    if (!nextName?.trim()) {
      return;
    }

    setFiles((currentFiles) =>
      currentFiles.map((item) =>
        item.id === fileId ? { ...item, name: nextName.trim(), updatedAt: new Date().toISOString() } : item,
      ),
    );
  };

  const restoreHistory = (item) => {
    const restoredFile = {
      id: createId('file'),
      name: `restored-${item.fileName}`,
      language: item.language || 'javascript',
      code: item.code,
      updatedAt: new Date().toISOString(),
    };

    setFiles((currentFiles) => [...currentFiles, restoredFile]);
    setActiveFileId(restoredFile.id);
    setLogs(item.logs || []);
    setAiResponse(item.aiResponse || '');
    setActiveView('editor');
  };

  const formatActiveFile = () => {
    if (activeFile.language !== 'javascript') {
      setLogs([{ type: 'warn', content: 'Formatter currently supports JavaScript files.' }]);
      return;
    }

    updateCode(formatJavaScript(activeFile.code));
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebarDock = () => {
    setSidebarDock((currentDock) => (currentDock === 'left' ? 'right' : 'left'));
  };

  const updateSettings = (updates) => {
    setSettings((currentSettings) => ({ ...currentSettings, ...updates }));
  };

  const selectFile = (fileId) => {
    setActiveFileId(fileId);
    setActiveView('editor');
  };

  const copyAiResponse = async () => {
    if (!aiResponse) {
      return;
    }

    try {
      await navigator.clipboard.writeText(aiResponse);
    } catch (error) {
      console.error('Failed to copy AI response', error);
    }
  };

  const applyResponseCode = () => {
    const codeBlock = aiResponse.match(/```(?:\w+)?\n([\s\S]*?)```/);

    if (!codeBlock?.[1]) {
      setLogs([{ type: 'warn', content: 'No fenced code block found in the AI response.' }]);
      return;
    }

    updateCode(codeBlock[1].trim());
    setActiveView('editor');
  };

  const commands = [
    { action: () => setActiveView('editor'), hint: 'View', label: 'Open editor' },
    { action: runCode, hint: 'Run', label: 'Run code' },
    { action: () => analyzeCode(), hint: 'AI', label: 'Analyze code' },
    { action: formatActiveFile, hint: 'Edit', label: 'Format code' },
    { action: createFile, hint: 'Files', label: 'Create file' },
    { action: () => setActiveView('files'), hint: 'View', label: 'Open files' },
    { action: () => setActiveView('history'), hint: 'View', label: 'Open history' },
    { action: () => setActiveView('settings'), hint: 'View', label: 'Open settings' },
    { action: toggleTheme, hint: 'Theme', label: 'Toggle theme' },
    { action: toggleSidebarDock, hint: 'Layout', label: 'Move sidebar' },
  ];

  const sidebar = (
    <Sidebar
      activeView={activeView}
      dockSide={sidebarDock}
      onSelectView={setActiveView}
      onToggleDock={toggleSidebarDock}
    />
  );

  return (
    <div
      className={cn(
        'flex h-screen overflow-hidden bg-zinc-50 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-100',
        theme === 'dark' && 'dark',
      )}
    >
      {sidebarDock === 'left' && sidebar}

      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <TopBar
          activeFile={activeFile}
          backendStatus={backendStatus}
          isRunning={isRunning}
          loading={loading}
          models={models}
          onAnalyze={() => analyzeCode()}
          onFormat={formatActiveFile}
          onModelChange={setSelectedModel}
          onOpenPalette={() => setPaletteOpen(true)}
          onRun={runCode}
          onToggleTheme={toggleTheme}
          selectedModel={selectedModel}
          theme={theme}
        />

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {activeView === 'editor' ? (
              <CodeEditor
                code={activeFile.code}
                language={activeFile.language}
                onChange={updateCode}
                settings={settings}
                theme={theme}
              />
            ) : (
              <WorkspacePanel
                activeFileId={activeFile.id}
                activeView={activeView}
                files={files}
                history={history}
                onBackToEditor={() => setActiveView('editor')}
                onClearHistory={() => setHistory([])}
                onCreateFile={createFile}
                onDeleteFile={deleteFile}
                onDuplicateFile={duplicateFile}
                onRenameFile={renameFile}
                onRestoreHistory={restoreHistory}
                onSelectFile={selectFile}
                onToggleDock={toggleSidebarDock}
                onToggleTheme={toggleTheme}
                onUpdateFileLanguage={(fileId, language) =>
                  setFiles((currentFiles) =>
                    currentFiles.map((file) =>
                      file.id === fileId ? { ...file, language, updatedAt: new Date().toISOString() } : file,
                    ),
                  )
                }
                onUpdateSettings={updateSettings}
                settings={settings}
                sidebarDock={sidebarDock}
                theme={theme}
              />
            )}
            <TerminalPanel
              height={settings.terminalHeight}
              logs={logs}
              onClear={() => setLogs([])}
              onResize={(terminalHeight) => updateSettings({ terminalHeight })}
            />
          </div>

          <AiAssistantPanel
            aiResponse={aiResponse}
            issues={issues}
            onAnalyzeMode={analyzeCode}
            onApplyResponseCode={applyResponseCode}
            onCopyResponse={copyAiResponse}
            onResize={(aiWidth) => updateSettings({ aiWidth })}
            selectedModelName={selectedModelName}
            width={settings.aiWidth}
          />
        </div>
      </div>

      {sidebarDock === 'right' && sidebar}

      <CommandPalette commands={commands} onClose={() => setPaletteOpen(false)} open={paletteOpen} />
    </div>
  );
}

export default App;
