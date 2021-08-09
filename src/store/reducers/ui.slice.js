import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name : "ui",
    initialState : {},
    reducers : {
        setNavigationCircle(state , payload) {

        }
    }
})

export const { setNavigationCircle } = uiSlice.actions;
export default uiSlice.reducer;