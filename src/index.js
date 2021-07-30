import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import InitialLoader from "./Providers/InitialLoader";
import appStore from "./Store/appStore";
import StoreProvider from "./Store/Y-State";

import "./Styles/index.scss";

const whiteList = ['target' , 'habitPerWeek' , "stream"]

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider whiteSlice={whiteList} persistorEnabled store={appStore}>
        <InitialLoader>
            <App />
        </InitialLoader>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
