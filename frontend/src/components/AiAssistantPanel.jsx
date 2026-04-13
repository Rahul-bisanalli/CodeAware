import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Clipboard, Github, Lightbulb, Replace, ShieldCheck, TestTube2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GithubIssueCard } from './GithubIssueCard';

export function AiAssistantPanel({
  aiResponse,
  issues,
  onAnalyzeMode,
  onApplyResponseCode,
  onCopyResponse,
  selectedModelName,
  width,
  onResize,
}) {
  const startResize = (event) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = width;

    const onMove = (moveEvent) => {
      onResize(Math.min(620, Math.max(320, startWidth - (moveEvent.clientX - startX))));
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <aside className="relative flex h-full min-h-0 w-full flex-col gap-5 overflow-y-auto border-t border-zinc-200 bg-zinc-50 p-5 lg:w-[var(--assistant-width)] lg:border-l lg:border-t-0 dark:border-zinc-800 dark:bg-zinc-950" style={{ '--assistant-width': `${width}px` }}>
      <button
        aria-label="Resize assistant"
        className="absolute bottom-0 left-0 top-0 hidden w-2 cursor-col-resize transition hover:bg-emerald-500/20 lg:block"
        onPointerDown={startResize}
        type="button"
      />
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500 text-white dark:border-cyan-300/30 dark:bg-cyan-300 dark:text-zinc-950">
          <Bot size={23} />
        </div>
        <div>
          <div className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Learning Assistant</div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">{selectedModelName || 'Model loading'}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-xs font-semibold text-zinc-700 transition hover:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200" onClick={() => onAnalyzeMode('Generate a small set of tests for this code.')} type="button">
          <TestTube2 className="mb-1" size={16} />
          Generate tests
        </button>
        <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-xs font-semibold text-zinc-700 transition hover:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200" onClick={() => onAnalyzeMode('Find security, reliability, and edge-case risks in this code.')} type="button">
          <ShieldCheck className="mb-1" size={16} />
          Check risks
        </button>
        <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-xs font-semibold text-zinc-700 transition hover:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200" onClick={() => onAnalyzeMode('Optimize this code and explain the improvements clearly.')} type="button">
          <Lightbulb className="mb-1" size={16} />
          Optimize
        </button>
        <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-xs font-semibold text-zinc-700 transition hover:border-emerald-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200" disabled={!aiResponse} onClick={onCopyResponse} type="button">
          <Clipboard className="mb-1" size={16} />
          Copy answer
        </button>
        <button className="col-span-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-xs font-semibold text-zinc-700 transition hover:border-emerald-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200" disabled={!aiResponse} onClick={onApplyResponseCode} type="button">
          <Replace className="mb-1" size={16} />
          Apply first code block
        </button>
      </div>

      <AnimatePresence mode="wait">
        {aiResponse ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="markdown-body rounded-lg border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/70 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-black/20"
            exit={{ opacity: 0, y: 8 }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            className="rounded-lg border border-dashed border-zinc-300 bg-white/70 p-6 text-center text-sm leading-6 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            Select a model and analyze your code for targeted debugging guidance.
          </motion.div>
        )}
      </AnimatePresence>

      {issues.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400">
            <Github size={17} />
            Open Source Examples
          </div>
          {issues.map((issue, index) => (
            <GithubIssueCard issue={issue} index={index} key={`${issue.url}-${index}`} />
          ))}
        </section>
      )}
    </aside>
  );
}
