import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { WalletProvider } from "@/contexts/WalletContext";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="dark"
    enableSystem={false}
    forcedTheme="dark"
  >
    <WalletProvider>
      <App />
    </WalletProvider>
  </ThemeProvider>
);
