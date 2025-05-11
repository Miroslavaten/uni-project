import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/mainStyles.scss";
import App from "./App.tsx";
import TodoContextProvider from "./context/TodoContextProvider.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TodoContextProvider>
        <App />
      </TodoContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
