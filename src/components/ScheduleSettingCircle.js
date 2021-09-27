import { useLayoutEffect, useState } from "react";

import { FiArrowLeft, FiArrowRight, FiRotateCcw } from "react-icons/fi";
import { _date } from "../utils";


const ScheduleSettingCircle = ({ currentMonth , setCurrentMonth , setIsHoverInNavigationCircle , currentDay , goToday , visible }) => {
    const [isActive, setIsActive] = useState(false);
    const [transitionDelay, setTransitionDelay] = useState(1)
    const now = _date();
    

    const allMonthDay = now.clone().add(currentMonth - 1 , "M").daysInMonth();

    const currentMonthName = now.add(currentMonth - 1 , "M").format("MMMM")
    const currentDayName = _date(`${now.year()}/${now.month() + 1 + (currentMonth - 1)}/${currentDay + (allMonthDay === 31 ? 1 : 2)}`).format('dddd')
    
    const isNextMonthAvailable = (12 - (now.month() + currentMonth) ) > 0 ? true : false;

    const monthSelectHandler = (actionType , event) => {
        event?.stopPropagation();
        if(isActive) {
            if(actionType === "next") {
                setCurrentMonth(prev => prev + 1)
            }else setCurrentMonth(prev => prev - 1)
        }
    }

    useLayoutEffect(() => {
        if(visible) setTransitionDelay(0)
    } , [visible])

    return (
        <div 
            onMouseEnter={() => setIsHoverInNavigationCircle(true)} 
            onMouseLeave={() => setIsHoverInNavigationCircle(false)} 
            onClick={() => setIsActive(prev => !prev)}
            style={{ 
                transition: `all .3s cubic-bezier(1, 0, 0, 1) , bottom .3s ${transitionDelay}s`
             }}
            className={`setting ${visible ? "setting--visible" : ""} ${isActive ? "setting--active" : ""}`}>
            <div style={{ display : "flex" , flexDirection : "column" , alignItems : 'center' }}>
                <div style={{ display : "flex" , alignItems : 'center' }}>
                    <p style={{ fontWeight : 'bold' , marginRight : 10 }}>{currentDay}</p>
                    <p>{currentDayName}</p>
                </div>
                <p>{currentMonthName}</p>
            </div>
            <div className={`controller ${isActive ? 'controller--active' : ""}`}>
                <button onClick={goToday} className="controller__reset"><FiRotateCcw size={30} color="white" /></button>
                <button disabled={!isNextMonthAvailable} onClick={e => monthSelectHandler("next" , e)}><FiArrowRight color="white" size={30} /></button>
                <button onClick={e => monthSelectHandler("prev" , e)}><FiArrowLeft color="white" size={30} /></button>
            </div>
            
        </div>
    )
}


export default ScheduleSettingCircle;