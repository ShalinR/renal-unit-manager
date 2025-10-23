import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

(function boot(){
  try {
    console.log("[BOOT] main.tsx starting");
    const el = document.getElementById("root");
    if (!el) throw new Error("No #root element found in index.html");
    const root = createRoot(el);
    root.render(<App />);
    console.log("[BOOT] App rendered");
  } catch (err) {
    console.error("[BOOT] FATAL during mount:", err);
    const pre = document.createElement("pre");
    pre.style.padding = "16px";
    pre.style.whiteSpace = "pre-wrap";
    pre.style.background = "#fff3f3";
    pre.style.border = "1px solid #f5c2c7";
    pre.textContent = "Mount error:\\n" + (err && (err.stack || err.toString()));
    document.body.appendChild(pre);
  }
})();

