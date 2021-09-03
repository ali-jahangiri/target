import React from "react";
import ReactDOM from "react-dom";
import dayjs from "dayjs"
import jalaliday from "jalaliday";

import "./Styles/index.scss";

import App from "./App";

dayjs.extend(jalaliday)


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
