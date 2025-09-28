import { createRoot } from "react-dom/client";
import "./index.css";
import "./lib/i18n";
import { AuthProvider } from '@/hooks/useAuth';
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
