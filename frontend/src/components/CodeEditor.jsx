import Editor from '@monaco-editor/react';

export function CodeEditor({ code, language, onChange, settings, theme }) {
  return (
    <main className="min-h-0 flex-1 overflow-hidden bg-white dark:bg-zinc-950">
      <Editor
        height="100%"
        language={language}
        onChange={(value) => onChange(value ?? '')}
        options={{
          fontSize: settings.fontSize,
          fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          minimap: { enabled: settings.minimap },
          padding: { top: 24 },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: 'on',
          lineNumbersMinChars: 4,
          bracketPairColorization: { enabled: true },
          scrollBeyondLastLine: false,
          lineHeight: 24,
          wordWrap: settings.wordWrap,
        }}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
        value={code}
      />
    </main>
  );
}
