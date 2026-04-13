const workerSource = `
self.onmessage = async (event) => {
  const logs = [];
  const stringify = (value) => {
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  console.log = (...args) => logs.push({ type: 'log', content: args.map(stringify).join(' ') });
  console.error = (...args) => logs.push({ type: 'error', content: args.map(stringify).join(' ') });
  console.warn = (...args) => logs.push({ type: 'warn', content: args.map(stringify).join(' ') });

  try {
    const result = await new Function('"use strict";\\n' + event.data.code)();
    if (result !== undefined) {
      logs.push({ type: 'log', content: stringify(result) });
    }
    self.postMessage({ status: 'done', logs });
  } catch (error) {
    logs.push({ type: 'error', content: error.name + ': ' + error.message });
    self.postMessage({ status: 'done', logs });
  }
};
`;

export function runJavaScriptInWorker(code, timeout = 4000) {
  return new Promise((resolve) => {
    const blob = new Blob([workerSource], { type: 'text/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    const timer = window.setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve([{ type: 'error', content: `Execution timed out after ${timeout / 1000}s` }]);
    }, timeout);

    worker.onmessage = (event) => {
      window.clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve(Array.isArray(event.data.logs) ? event.data.logs : []);
    };

    worker.onerror = (event) => {
      window.clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve([{ type: 'error', content: event.message || 'Worker execution failed' }]);
    };

    worker.postMessage({ code });
  });
}

export function formatJavaScript(code) {
  const lines = code
    .replace(/\{/g, ' {\n')
    .replace(/\}/g, '\n}\n')
    .replace(/;/g, ';\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let depth = 0;
  return lines
    .map((line) => {
      if (line.startsWith('}')) {
        depth = Math.max(0, depth - 1);
      }

      const formatted = `${'  '.repeat(depth)}${line}`;

      if (line.endsWith('{')) {
        depth += 1;
      }

      return formatted;
    })
    .join('\n');
}
