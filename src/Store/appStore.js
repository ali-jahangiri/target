import { combineSlice, createStore } from "./Y-State";

import artWorkSlice from "./slices/artWorkSlice";
import userSlice from "./slices/userSlice";
import habitStreamSlice from "./slices/habitStreamSlice";

const appStore = createStore(combineSlice({
    artwork : artWorkSlice,
    user : userSlice,
    habitStream : habitStreamSlice
}));

export default appStore;
