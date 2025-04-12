import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import App from "@/app/layout";
import { BrowserRouter } from "react-router-dom";
import QueryProvider from "@/components/providers/query.provider";
import { ThemeProvider } from "@/components/providers/theme.provider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="lumini-theme">
    <BrowserRouter>
      <QueryProvider>
        <App />
      </QueryProvider>
    </BrowserRouter>
  </ThemeProvider>
);
