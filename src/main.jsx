import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "../src/Components/store/store";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./index.css"

import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { KycProvider } from "./context/KycContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <div className="bgcolr">
      <KycProvider>
    <App />
    </KycProvider>
    </div>
  </Provider>
);
