import { Bot, Code2, Loader2, Moon, Play, Sparkles, Sun, Wand2 } from 'lucide-react';
import { Button } from './ui/Button';

export function TopBar({
  models,
  selectedModel,
  onModelChange,
  onRun,
  onAnalyze,
  onFormat,
  isRunning,
  loading,
  theme,
  onToggleTheme,
  activeFile,
  onOpenPalette,
  backendStatus,
}) {
  const isDark = theme === 'dark';
  const backendLabel = backendStatus === 'connected' ? 'Backend connected' : backendStatus === 'offline' ? 'Backend offline' : 'Checking backend';

  return (
    <header className="flex min-h-20 flex-col gap-4 border-b border-zinc-200 bg-white/85 px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6 dark:border-zinc-800 dark:bg-zinc-950/85">
      <div>
        <div className="flex items-center gap-3 text-xl font-bold text-zinc-950 dark:text-zinc-50">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white dark:bg-emerald-400 dark:text-zinc-950">
            <Sparkles size={20} />
          </span>
          CodeAware
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {activeFile?.name || 'Untitled'} · Press Ctrl+K for commands
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <span className={backendStatus === 'connected' ? 'h-2 w-2 rounded-full bg-emerald-500' : 'h-2 w-2 rounded-full bg-red-500'} />
          {backendLabel}
        </div>
        <select
          className="h-10 min-w-52 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition hover:border-emerald-500 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-emerald-400/70 dark:focus:border-emerald-400"
          onChange={(event) => onModelChange(event.target.value)}
          title="Select AI model"
          value={selectedModel}
        >
          {models.length === 0 && <option value={selectedModel}>Gemini Flash</option>}
          {models.map((model) => (
            <option key={model.id} title={model.description} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <Button aria-label="Open command palette" className="w-10 px-0" onClick={onOpenPalette}>
            <Code2 size={17} />
          </Button>
          <Button aria-label="Toggle theme" className="w-10 px-0" onClick={onToggleTheme}>
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </Button>
          <Button className="hidden sm:inline-flex" onClick={onFormat}>
            <Wand2 size={16} />
            Format
          </Button>
          <Button className="flex-1 sm:flex-none" disabled={isRunning} onClick={onRun}>
            <Play fill="currentColor" size={16} />
            Run
          </Button>
          <Button className="flex-1 sm:flex-none" disabled={loading} onClick={onAnalyze} variant="primary">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Bot size={18} />}
            {loading ? 'Analyzing' : 'Analyze'}
          </Button>
        </div>
      </div>
    </header>
  );
}
