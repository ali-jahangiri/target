import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import InitialLoader from "./Providers/InitialLoader";
import { FetchProvider } from "./Providers/useFetch";
import appStore from "./Store/appStore";
import StoreProvider from "./Store/Y-State";

import "./Styles/index.scss";

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={appStore}>
      <FetchProvider baseURL="https://api.artsy.net/api">
        <InitialLoader>
            <App />
        </InitialLoader>
      </FetchProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
