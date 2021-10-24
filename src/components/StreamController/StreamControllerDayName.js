import { currentDateName } from "../../utils";


const StreamControllerDayName = ({ currentDay , currentMonth , isActive }) => {
    const { day , month } = currentDateName(currentMonth , currentDay)

    return (
        <div className={`streamControllerDayName ${isActive ? "streamControllerDayName--inActive" : ""}`}>
            <div>
                <p>{currentDay}</p>
                <p>{day}</p>
            </div>
            <p>{month}</p>
        </div>
    )
}


export default StreamControllerDayName;