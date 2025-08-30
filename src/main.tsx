import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Tasks } from "./features/signals-mvvm-commands/TasksPropDrilling/Tasks.view.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Tasks />
  </StrictMode>,
);
