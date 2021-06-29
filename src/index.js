import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { FetchProvider } from "./Providers/useFetch";

import "./Styles/index.scss";

ReactDOM.render(
  <React.StrictMode>
    <FetchProvider baseURL="https://api.artsy.net/api">
      <App />
    </FetchProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
