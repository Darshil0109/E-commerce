
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import Store from "./store/Store.js";
import { BrowserRouter as Router} from "react-router-dom";
import './index.css'
createRoot(document.getElementById("root")).render(
    <Provider store={Store}>
      <Router>
        <App />
      </Router>
    </Provider>
);
