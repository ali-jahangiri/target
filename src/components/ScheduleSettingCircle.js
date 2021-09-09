import { useState } from "react";

import { FiArrowLeft, FiArrowRight, FiRotateCcw } from "react-icons/fi";
import { _date } from "../utils";


const ScheduleSettingCircle = ({ rotate ,  currentMonth , setCurrentMonth , setIsHoverInNavigationCircle , currentDay , goToday }) => {
    const [isActive, setIsActive] = useState(false);
    const now = _date();
    
    const currentMonthName = now.add(currentMonth - 1 , "M").format("MMMM")
    const currentDayName = _date(`${now.year()}/${now.month() + 1 + (currentMonth - 1)}/${currentDay + 1}`).format('dddd')

    
    // const isVisible = useSelector(state => state.ui.navigatorVisibilityStatus);
    const isVisible = false
    
    const nextMonthAvailable = (12 - (now.month() + currentMonth) ) > 0 ? true : false

    const monthSelectHandler = (actionType , event) => {
        event?.stopPropagation();
        if(isActive) {
            if(actionType === "next") {
                setCurrentMonth(prev => prev + 1)
            }else setCurrentMonth(prev => prev - 1)
        }
    }


    // useEffect(() => {
    //     window.addEventListener("keydown" , e => {
    //         // e.preventDefault()
    //         const pressedKey = e.key;
    //         console.log(pressedKey);
    //         if(pressedKey === "ArrowRight") {
    //             monthSelectHandler("next")
    //             window.removeEventListener("keydown" , e => console.log('clear'))
    //         }else if(pressedKey === "ArrowLeft") {
    //             monthSelectHandler('prev')
    //             window.removeEventListener("keydown" , e => console.log('clear'))
    //         }
    //     })
    //     return window.removeEventListener("keydown" , () => {})
    // } , [])
    return (
        <div 
            onMouseEnter={() => setIsHoverInNavigationCircle(true)} 
            onMouseLeave={() => setIsHoverInNavigationCircle(false)} 
            onClick={() => setIsActive(prev => !prev)} 
            className={`setting ${isActive ? "setting--active" : ""} ${!isVisible ? "setting--hide" : "" }`}>
            <div style={{ display : "flex" , flexDirection : "column" , alignItems : 'center' }}>
                <div style={{ display : "flex" , alignItems : 'center' }}>
                    <p style={{ fontWeight : 'bold' , marginRight : 10 }}>{currentDay}</p>
                    <p>{currentDayName}</p>
                </div>
                <p style={{ transform : `rotate(${isActive ? 0 : rotate}deg)` }}>{currentMonthName}</p>
            </div>
            <div className={`controller ${isActive ? 'controller--active' : ""}`}>
                <button onClick={goToday} className="controller__reset"><FiRotateCcw size={30} color="white" /></button>
                <button disabled={!nextMonthAvailable} onClick={e => monthSelectHandler("next" , e)}><FiArrowRight color="white" size={30} /></button>
                <button disabled={""} onClick={e => monthSelectHandler("prev" , e)}><FiArrowLeft color="white" size={30} /></button>
            </div>
            
        </div>
    )
}


export default ScheduleSettingCircle;