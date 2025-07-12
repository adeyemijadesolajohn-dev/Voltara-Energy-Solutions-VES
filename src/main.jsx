import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SidebarProvider } from "./components/hooks/SidebarContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </StrictMode>
);
