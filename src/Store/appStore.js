import { combineSlice, createStore } from "./Y-State";

import targetSlice from "./slices/targetSlice";
import habitPerWeekSlice from "./slices/habitPerWeekSlice";
import streamSlice from "./slices/streamSlice";
import uiSlice from "./slices/uiSlice";

const appStore = createStore(combineSlice({
    target : targetSlice,
    habitPerWeek : habitPerWeekSlice,
    stream : streamSlice,
    ui : uiSlice
}));

export default appStore;
