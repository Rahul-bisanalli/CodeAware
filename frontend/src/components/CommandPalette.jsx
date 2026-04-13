import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';

export function CommandPalette({ commands, open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/35 px-4 pt-24 backdrop-blur-sm"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onMouseDown={onClose}
      >
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <Search className="text-zinc-400" size={18} />
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Command Palette</div>
            <div className="ml-auto rounded border border-zinc-200 px-2 py-1 text-xs text-zinc-500 dark:border-zinc-800">Esc</div>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {commands.map((command) => (
              <button
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
                key={command.label}
                onClick={() => {
                  command.action();
                  onClose();
                }}
                type="button"
              >
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{command.label}</span>
                <span className="text-xs text-zinc-500">{command.hint}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
