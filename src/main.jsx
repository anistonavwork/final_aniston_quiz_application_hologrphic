import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// If using vite-plugin-pwa with autoUpdate, it injects this virtual module:
import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {
    // we can show a custom "New version available" toast later if you want
    console.log("New content available. Reload to update.");
  },
  onOfflineReady() {
    console.log("App ready to work offline.");
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
