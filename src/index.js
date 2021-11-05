import React from "react";
import ReactDOM from "react-dom";
import dayjs from "dayjs"
import jalaliday from "jalaliday";

import "./Styles/index.scss";
import "../node_modules/react-resizable/css/styles.css";
import "../node_modules/react-grid-layout/css/styles.css";

import App from "./App";


dayjs.extend(jalaliday)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
