import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Debug console for mobile
if (typeof window !== 'undefined') {
  const logs: string[] = [];
  const el = document.createElement('div');
  el.id = 'debug-console';
  el.style.cssText = 'position:fixed;bottom:90px;left:8px;right:8px;max-height:180px;overflow:auto;background:rgba(0,0,0,0.92);color:#0f0;font:10px/1.3 monospace;padding:8px;border-radius:8px;z-index:99999;word-break:break-all;';
  document.body.appendChild(el);

  function stringify(arg: any): string {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'string') return arg;
    if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
    try { return JSON.stringify(arg); } catch { return String(arg); }
  }

  function addLog(type: string, msg: string) {
    logs.push(`[${type}] ${msg}`);
    if (logs.length > 30) logs.shift();
    el.textContent = logs.join('\n');
    el.scrollTop = el.scrollHeight;
  }

  const oe = console.error, ol = console.log, ow = console.warn;
  console.error = (...a) => { addLog('E', a.map(stringify).join(' ')); oe(...a); };
  console.warn = (...a) => { addLog('W', a.map(stringify).join(' ')); ow(...a); };
  console.log = (...a) => { addLog('L', a.map(stringify).join(' ')); ol(...a); };
  window.addEventListener('unhandledrejection', (e) => addLog('E', stringify(e.reason)));
}

createRoot(document.getElementById("root")!).render(<App />);
