import { motion } from 'framer-motion';
import { RotateCcw, Terminal } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/cn';

export function TerminalPanel({ height, logs, onClear, onResize }) {
  const startResize = (event) => {
    event.preventDefault();
    const startY = event.clientY;
    const startHeight = height;

    const onMove = (moveEvent) => {
      onResize(Math.min(420, Math.max(150, startHeight - (moveEvent.clientY - startY))));
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <section className="relative border-t border-zinc-200 bg-zinc-100 px-4 py-4 font-mono md:px-6 dark:border-zinc-800 dark:bg-black/60" style={{ height }}>
      <button
        aria-label="Resize terminal"
        className="absolute left-0 top-0 h-2 w-full cursor-row-resize bg-transparent transition hover:bg-emerald-500/20"
        onPointerDown={startResize}
        type="button"
      />
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-600 dark:text-emerald-300">
          <Terminal size={16} />
          Debug Console
        </div>
        <Button aria-label="Clear logs" className="h-8 w-8 px-0" onClick={onClear} variant="ghost">
          <RotateCcw size={14} />
        </Button>
      </div>

      <div className="h-[calc(100%-2.75rem)] overflow-y-auto rounded-lg border border-zinc-200 bg-white p-3 text-sm leading-7 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-300">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'flex gap-3 border-b border-zinc-100 py-1 dark:border-white/[0.03]',
                log.type === 'error' && 'bg-red-500/5 text-red-600 dark:text-red-300',
              )}
              initial={{ opacity: 0, x: -8 }}
              key={`${log.content}-${index}`}
            >
              <span className="text-zinc-400 dark:text-zinc-600">&gt;</span>
              <span className="break-words">{log.content}</span>
            </motion.div>
          ))
        ) : (
          <div className="text-zinc-500">System ready. Run code to see execution results.</div>
        )}
      </div>
    </section>
  );
}
