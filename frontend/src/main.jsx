import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { store } from "./redux/store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0F0F0F",
              color: "#FFFFFF",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            },
            success: {
              iconTheme: { primary: "#D4AF37", secondary: "#000" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#000" },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);