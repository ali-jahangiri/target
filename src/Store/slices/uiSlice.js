import { createSlice } from "../Y-State";

const uiSlice = createSlice({
    name : "ui",
    initialState : {
        navigatorVisibilityStatus : true,
        isInDragging : false
    },
    reducers : {
        setNavigationCircleStatus(state , payload) {
            return {
                ...state,
                navigatorVisibilityStatus : payload
            }
        },
        setIsInDragging(state , payload) {
            return {
                ...state,
                isInDragging : payload
            }
        }
    }
})


export const { setNavigationCircleStatus , setIsInDragging } = uiSlice.actions
export default uiSlice.reducer;