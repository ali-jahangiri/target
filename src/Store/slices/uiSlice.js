import { createSlice } from "../Y-State";

const uiSlice = createSlice({
    name : "ui",
    initialState : {
        navigatorVisibilityStatus : true
    },
    reducers : {
        setNavigationCircleStatus(state , payload) {
            return {
                ...state,
                navigatorVisibilityStatus : payload
            }
        }
    }
})


export const { setNavigationCircleStatus } = uiSlice.actions
export default uiSlice.reducer;