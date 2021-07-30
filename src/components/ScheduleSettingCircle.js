import { useState } from "react";

import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import Persian from "persian-date";
import { useEffect } from "react";

const ScheduleSettingCircle = ({ rotate ,  currentMonth , setCurrentMonth , setIsHoverInNavigationCircle }) => {
    const [isActive, setIsActive] = useState(false);
    const now = new Persian()
    const currentMonthName = now.add("month" , currentMonth).format('MMMM');

    const nextMonthAvailable = (12 - (now.month() + currentMonth) ) > 0 ? true : false

    let helper = isActive;
    const monthSelectHandler = (actionType , event) => {
        event?.stopPropagation();
        if(isActive) {
            if(actionType === "next") {
                setCurrentMonth(prev => prev + 1)
            }else setCurrentMonth(prev => prev - 1)
        }
    }


    useEffect(() => {
        window.addEventListener("keydown" , e => {
            // e.preventDefault()
            const pressedKey = e.key;
            console.log(pressedKey);
            if(pressedKey === "ArrowRight") {
                monthSelectHandler("next")
                window.removeEventListener("keydown" , e => console.log('clear'))
            }else if(pressedKey === "ArrowLeft") {
                monthSelectHandler('prev')
                window.removeEventListener("keydown" , e => console.log('clear'))
            }
        })
        return window.removeEventListener("keydown" , () => {})
    } , [])
    return (
        <div onMouseEnter={() => setIsHoverInNavigationCircle(true)} onMouseLeave={() => setIsHoverInNavigationCircle(false)} onClick={() => setIsActive(prev => !prev)} className={`setting ${isActive ? "setting--active" : ""}`}>
            <p style={{ transform : `rotate(${isActive ? 0 : rotate}deg)` }}>{currentMonthName}</p>
            <div className={`controller ${isActive ? 'controller--active' : ""}`}>
                <button disabled={!nextMonthAvailable} onClick={e => monthSelectHandler("next" , e)}><FiArrowRight color="white" size={30} /></button>
                <button disabled={""} onClick={e => monthSelectHandler("prev" , e)}><FiArrowLeft color="white" size={30} /></button>
            </div>
        </div>
    )
}


export default ScheduleSettingCircle;