import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App";
import "./assets/styles.css";
import { AuthProvider } from "./contexts/authContext";

createRoot(document.getElementById("root")).render(<App />);
