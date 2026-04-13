import { FileCode, History, Moon, PanelRight, Plus, Settings, Sun, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/cn';

function PanelHeader({ icon: Icon, eyebrow, title }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500 text-white dark:bg-emerald-400 dark:text-zinc-950">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase text-emerald-600 dark:text-emerald-300">{eyebrow}</p>
        <h1 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">{title}</h1>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{label}</span>
      {children}
    </label>
  );
}

export function WorkspacePanel({
  activeFileId,
  activeView,
  files,
  history,
  onBackToEditor,
  onClearHistory,
  onCreateFile,
  onDeleteFile,
  onDuplicateFile,
  onRenameFile,
  onRestoreHistory,
  onSelectFile,
  onToggleDock,
  onToggleTheme,
  onUpdateFileLanguage,
  onUpdateSettings,
  settings,
  sidebarDock,
  theme,
}) {
  if (activeView === 'files') {
    return (
      <main className="min-h-0 flex-1 overflow-y-auto bg-zinc-50 p-6 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl">
          <PanelHeader eyebrow="Workspace" icon={FileCode} title="Files" />

          <div className="mb-4 flex flex-wrap gap-2">
            <Button onClick={onCreateFile} variant="primary">
              <Plus size={17} />
              New file
            </Button>
            <Button disabled={!activeFileId} onClick={onDuplicateFile}>Duplicate active</Button>
          </div>

          <div className="grid gap-3">
            {files.map((file) => (
              <section
                className={cn(
                  'rounded-lg border bg-white p-4 shadow-sm transition dark:bg-zinc-900/70',
                  file.id === activeFileId
                    ? 'border-emerald-500 dark:border-emerald-400'
                    : 'border-zinc-200 dark:border-zinc-800',
                )}
                key={file.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button className="text-left" onClick={() => onSelectFile(file.id)} type="button">
                    <div className="text-base font-semibold text-zinc-950 dark:text-zinc-50">{file.name}</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {file.language} · {file.code.split('\n').length} lines
                    </div>
                  </button>

                  <div className="flex flex-wrap gap-2">
                    <select
                      className="h-9 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                      onChange={(event) => onUpdateFileLanguage(file.id, event.target.value)}
                      value={file.language}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="json">JSON</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                    </select>
                    <Button onClick={() => onRenameFile(file.id)}>Rename</Button>
                    <Button disabled={files.length <= 1} onClick={() => onDeleteFile(file.id)} variant="ghost">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (activeView === 'history') {
    return (
      <main className="min-h-0 flex-1 overflow-y-auto bg-zinc-50 p-6 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl">
          <PanelHeader eyebrow="Activity" icon={History} title="History" />

          <div className="mb-4 flex justify-between gap-3">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Runs and analyses are saved locally on this device.</p>
            <Button disabled={history.length === 0} onClick={onClearHistory}>Clear</Button>
          </div>

          <div className="grid gap-3">
            {history.length === 0 ? (
              <section className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
                Run or analyze code to start building history.
              </section>
            ) : (
              history.map((item) => (
                <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70" key={item.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold uppercase text-emerald-600 dark:text-emerald-300">{item.type}</div>
                      <div className="mt-1 text-base font-semibold text-zinc-950 dark:text-zinc-50">{item.fileName}</div>
                      <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{new Date(item.createdAt).toLocaleString()}</div>
                      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{item.summary}</p>
                    </div>
                    <Button onClick={() => onRestoreHistory(item)}>Restore</Button>
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </main>
    );
  }

  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl">
        <PanelHeader eyebrow="Preferences" icon={Settings} title="Settings" />

        <div className="grid gap-4">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Appearance</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Theme and sidebar preferences are saved locally.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={onToggleTheme}>
                  <ThemeIcon size={17} />
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </Button>
                <Button onClick={onToggleDock}>
                  <PanelRight size={17} />
                  Move sidebar from {sidebarDock}
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Editor</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Font size">
                <input
                  className="h-10 rounded-lg border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950"
                  max="22"
                  min="12"
                  onChange={(event) => onUpdateSettings({ fontSize: Number(event.target.value) })}
                  type="number"
                  value={settings.fontSize}
                />
              </Field>
              <Field label="Word wrap">
                <select
                  className="h-10 rounded-lg border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950"
                  onChange={(event) => onUpdateSettings({ wordWrap: event.target.value })}
                  value={settings.wordWrap}
                >
                  <option value="off">Off</option>
                  <option value="on">On</option>
                </select>
              </Field>
              <Field label="Minimap">
                <select
                  className="h-10 rounded-lg border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950"
                  onChange={(event) => onUpdateSettings({ minimap: event.target.value === 'true' })}
                  value={String(settings.minimap)}
                >
                  <option value="false">Hidden</option>
                  <option value="true">Visible</option>
                </select>
              </Field>
              <Field label="Auto save">
                <select
                  className="h-10 rounded-lg border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950"
                  onChange={(event) => onUpdateSettings({ autoSave: event.target.value === 'true' })}
                  value={String(settings.autoSave)}
                >
                  <option value="true">On</option>
                  <option value="false">Off</option>
                </select>
              </Field>
            </div>
            <Button className="mt-5" onClick={onBackToEditor} variant="primary">Back to editor</Button>
          </section>
        </div>
      </div>
    </main>
  );
}
