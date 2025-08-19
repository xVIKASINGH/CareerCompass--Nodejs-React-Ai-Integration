import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import { ResumeProvider } from "./contexts/ResumeContext"; // ✅ import provider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ResumeProvider>   {/* ✅ wrap App inside provider */}
      <App />
      <Toaster />
    </ResumeProvider>
  </StrictMode>
);
