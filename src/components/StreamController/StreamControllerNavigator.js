import { FiArrowLeft, FiArrowRight, FiRotateCcw } from "react-icons/fi";
import { _date } from "../../utils";

const StreamControllerNavigator = ({
    isActive ,
    goTodayHandler ,
    setCurrentMonth,
    currentMonth,
    currentDay,
}) => {
    const now = _date();

    const isNextMonthAvailable = (12 - (now.month() + currentMonth) ) > 0 ? true : false;
    const isCurrentlyInToday = now.date() === currentDay;

    const monthSelectHandler = (actionType , event) => {
        event.stopPropagation();
        if(isActive) {
            if(actionType === "next") setCurrentMonth(prev => prev + 1)
            else setCurrentMonth(prev => prev - 1)
        }
    }

    return (
        <div className={`streamControllerNavigator ${isActive ? 'streamControllerNavigator--active' : ""}`}>
            <button disabled={isCurrentlyInToday} onClick={goTodayHandler} className="streamControllerNavigator__reset"><FiRotateCcw size={30} color="white" /></button>
            <button disabled={!isNextMonthAvailable} onClick={e => monthSelectHandler("next" , e)}><FiArrowRight color="white" size={30} /></button>
            <button onClick={e => monthSelectHandler("prev" , e)}><FiArrowLeft color="white" size={30} /></button>
        </div>
    )
}


export default StreamControllerNavigator;