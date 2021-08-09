import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {EmojiProvider } from "react-apple-emojis"

import "./Styles/index.scss";
import store from "./store/store";
import emojiData from 'react-apple-emojis/lib/data.json'
import AppRouter from "./Router/AppRouter"

import dayjs from "dayjs"
import jalaliday from "jalaliday";

dayjs.extend(jalaliday)


ReactDOM.render(
  <React.StrictMode>
    <EmojiProvider data={emojiData}>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </EmojiProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
