import { createSlice } from "../Y-State"
const artworkSlice = createSlice({
    name : "artwork",
    initialState : [],
    reducers : {
        set : (state , payload) => {
            return payload
        },
        clear : () => {

        }
    }
})

export const { set } = artworkSlice.actions
export default artworkSlice.reducer;