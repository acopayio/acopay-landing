import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Buffer } from "buffer";
import "./index.css";
import App from "./App";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { ThemeProvider } from "./theme/ThemeProvider";

// @solana/web3.js expects Node Buffer in the browser
(globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);
