import { motion } from 'framer-motion';
import { Code, FileCode, History, PanelLeft, PanelRight, Settings } from 'lucide-react';
import { cn } from '../lib/cn';

const navItems = [
  { icon: Code, id: 'editor', label: 'Editor' },
  { icon: FileCode, id: 'files', label: 'Files' },
  { icon: History, id: 'history', label: 'History' },
];

function NavIcon({ icon: Icon, label, active, dockSide = 'left', onClick }) {
  return (
    <button
      className={cn(
        'relative flex h-11 w-11 items-center justify-center rounded-lg border transition',
        active
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300'
          : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-100',
      )}
      onClick={onClick}
      title={label}
      type="button"
    >
      {active && (
        <span
          className={cn(
            'absolute h-5 w-1 bg-emerald-500 dark:bg-emerald-400',
            dockSide === 'right' ? '-right-3 rounded-l' : '-left-3 rounded-r',
          )}
        />
      )}
      <Icon size={21} />
    </button>
  );
}

export function Sidebar({ activeView, dockSide, onSelectView, onToggleDock }) {
  const DockIcon = dockSide === 'left' ? PanelRight : PanelLeft;

  return (
    <>
      <motion.nav
        className={cn(
          'hidden h-screen w-20 shrink-0 cursor-grab flex-col items-center border-zinc-200 bg-white py-5 active:cursor-grabbing md:flex dark:border-zinc-800 dark:bg-zinc-950',
          dockSide === 'right' ? 'border-l' : 'border-r',
        )}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.22}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 40) {
            onToggleDock();
          }
        }}
      >
        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-emerald-300">
          <Code size={22} />
        </div>

        <div className="flex flex-1 flex-col items-center gap-3">
          {navItems.map((item) => (
            <NavIcon
              active={activeView === item.id}
              dockSide={dockSide}
              key={item.label}
              onClick={() => onSelectView(item.id)}
              {...item}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <NavIcon dockSide={dockSide} icon={DockIcon} label={`Move sidebar ${dockSide === 'left' ? 'right' : 'left'}`} onClick={onToggleDock} />
          <NavIcon
            active={activeView === 'settings'}
            dockSide={dockSide}
            icon={Settings}
            label="Settings"
            onClick={() => onSelectView('settings')}
          />
        </div>
      </motion.nav>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-zinc-200 bg-white/95 px-3 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
        {[...navItems, { icon: Settings, id: 'settings', label: 'Settings' }].map((item) => (
          <NavIcon
            active={activeView === item.id}
            dockSide="left"
            key={item.label}
            onClick={() => onSelectView(item.id)}
            {...item}
          />
        ))}
      </nav>
    </>
  );
}
