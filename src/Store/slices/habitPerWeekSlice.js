import { createSlice } from "../Y-State";

const habitPerWeekSlice = createSlice({
    name : "habitPerWeek",
    initialState : {},
    reducers : {
        setTargetSchedule(state , payload) {
            return {
                ...state,
                [payload.id] : payload.schedule
            }
        }
    }
})


export const { setTargetSchedule } = habitPerWeekSlice.actions
export default habitPerWeekSlice.reducer;