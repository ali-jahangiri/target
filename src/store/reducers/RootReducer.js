import { combineReducers } from "redux";

// slices
import uiSlice from "./ui.slice";

const RootReducer = combineReducers({
    ui : uiSlice
})



export default RootReducer;