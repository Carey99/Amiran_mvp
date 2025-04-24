import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import Material Icons
const materialIcons = document.createElement('link');
materialIcons.rel = 'stylesheet';
materialIcons.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
document.head.appendChild(materialIcons);

// Roboto Font
const robotoFont = document.createElement('link');
robotoFont.rel = 'stylesheet';
robotoFont.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
document.head.appendChild(robotoFont);

createRoot(document.getElementById("root")!).render(<App />);
