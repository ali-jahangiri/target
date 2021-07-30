import { createSlice } from "../Y-State";

const streamSlice = createSlice({
    name : "stream",
    initialState : {},
    reducers : {
        setStream(state , payload) {
            return {
                ...state,
                [payload.id] : payload.items
            }
        }
    }
});

export const { setStream } = streamSlice.actions;
export default streamSlice.reducer;