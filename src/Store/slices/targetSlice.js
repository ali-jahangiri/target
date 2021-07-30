import { createSlice } from "../Y-State";

const targetSlice = createSlice({
    name : "target",
    initialState : {},
    reducers : {
        setNewTarget(state , payload) {
            return {
                ...state,
                [payload.id] : payload.details
            }
        },
        removeTarget(state , payload){
            return {
                ...state , 
                [payload.id] : undefined
            }
        }
    }
})



export const { setNewTarget , removeTarget } = targetSlice.actions;
export default targetSlice.reducer