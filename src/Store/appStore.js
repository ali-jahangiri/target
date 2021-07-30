import { combineSlice, createStore } from "./Y-State";

import targetSlice from "./slices/targetSlice";
import habitPerWeekSlice from "./slices/habitPerWeekSlice";
import streamSlice from "./slices/streamSlice";

const appStore = createStore(combineSlice({
    target : targetSlice,
    habitPerWeek : habitPerWeekSlice,
    stream : streamSlice
}));

export default appStore;
