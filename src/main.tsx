import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Talk from "./Talk.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Talk />
  </StrictMode>,
);
