import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { EditorProvider } from "./context/EditorContext";

createRoot(document.getElementById("root")!).render(
  <EditorProvider>
    <App />
  </EditorProvider>
);
