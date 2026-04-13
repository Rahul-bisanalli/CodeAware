import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export function GithubIssueCard({ issue, index }) {
  return (
    <motion.a
      animate={{ opacity: 1, y: 0 }}
      className="block rounded-lg border border-zinc-200 bg-white p-4 text-zinc-900 transition hover:border-emerald-500 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:border-emerald-400/70 dark:hover:bg-zinc-900"
      href={issue.url}
      initial={{ opacity: 0, y: 10 }}
      rel="noreferrer"
      target="_blank"
      transition={{ delay: index * 0.06 }}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">{issue.repo}</div>
        <ExternalLink className="shrink-0 text-zinc-400 dark:text-zinc-500" size={13} />
      </div>
      <div className="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-100">{issue.title}</div>
    </motion.a>
  );
}
