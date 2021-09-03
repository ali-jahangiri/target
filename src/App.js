import { Provider } from "react-redux";
import emojiData from 'react-apple-emojis/lib/data.json'
import { EmojiProvider } from "react-apple-emojis";

import { AlertContainer } from "./components/Alert";
import AppRouter from "./Router/AppRouter";
import store from "./store/store";

const App = () => (
  <EmojiProvider data={emojiData}>
      <Provider store={store}>
        <AlertContainer/>
        <AppRouter />        
      </Provider>
  </EmojiProvider>
)

export default App;
