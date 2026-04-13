import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

const variants = {
  primary:
    'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-600 dark:border-emerald-400/40 dark:bg-emerald-400 dark:text-zinc-950 dark:shadow-emerald-950/30 dark:hover:bg-emerald-300',
  secondary:
    'border-zinc-300 bg-white text-zinc-800 hover:border-emerald-500 hover:bg-zinc-100 dark:border-zinc-700/80 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:border-emerald-400/70 dark:hover:bg-zinc-800',
  ghost:
    'border-transparent bg-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100',
};

export function Button({ children, className, variant = 'secondary', ...props }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
