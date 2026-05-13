import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Mobile debug console — shows errors on screen
if (typeof window !== 'undefined') {
  const logs: string[] = [];
  const el = document.createElement('div');
  el.id = 'debug-console';
  el.style.cssText = 'position:fixed;bottom:90px;left:8px;right:8px;max-height:200px;overflow:auto;background:rgba(0,0,0,0.9);color:#0f0;font:11px/1.4 monospace;padding:8px;border-radius:8px;z-index:99999;pointer-events:auto;display:none;';
  document.body.appendChild(el);

  // Toggle with 3 finger tap
  let tapCount = 0;
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 3) {
      tapCount++;
      if (tapCount >= 1) {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
        tapCount = 0;
      }
    }
  });

  function addLog(type: string, msg: string) {
    logs.push(`[${type}] ${msg}`);
    if (logs.length > 50) logs.shift();
    el.textContent = logs.join('\n');
    el.scrollTop = el.scrollHeight;
  }

  const origConsoleError = console.error;
  const origConsoleLog = console.log;
  const origConsoleWarn = console.warn;

  console.error = (...args) => { addLog('ERR', args.map(String).join(' ')); origConsoleError(...args); };
  console.warn = (...args) => { addLog('WRN', args.map(String).join(' ')); origConsoleWarn(...args); };
  console.log = (...args) => { addLog('LOG', args.map(String).join(' ')); origConsoleLog(...args); };

  window.addEventListener('error', (e) => addLog('ERR', e.message));
  window.addEventListener('unhandledrejection', (e) => addLog('ERR', String(e.reason)));
}

createRoot(document.getElementById("root")!).render(<App />);
