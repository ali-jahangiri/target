import { combineSlice, createStore } from "./Y-State";

import artWorkSlice from "./slices/artWorkSlice";
import userSlice from "./slices/userSlice";

const appStore = createStore(combineSlice({
    artwork : artWorkSlice,
    user : userSlice
}));

export default appStore;
