import { createSlice } from "../Y-State";

const habitStreamSlice = createSlice({
    name : "habitStream",
    initialState : {},
    reducers : {
        setInStream(state , payload) {
            return {
                ...state,
                [payload.id] : payload.items
            }
        }
    }
});

export const { setInStream } = habitStreamSlice.actions;
export default habitStreamSlice.reducer;