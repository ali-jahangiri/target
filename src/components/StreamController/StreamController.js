import { useLayoutEffect, useState } from "react";

import StreamControllerDayName from "./StreamControllerDayName";
import StreamControllerNavigator from "./StreamControllerNavigator";


const StreamController = ({ 
    currentMonth , 
    currentDay , 
    setCurrentMonth , 
    setIsHoverInNavigationCircle , 
    goToday , 
    visible
}) => {
    const [isActive, setIsActive] = useState(false);
    const [transitionDelay, setTransitionDelay] = useState(1);

    useLayoutEffect(() => {
        if(visible) setTransitionDelay(0)
    } , [visible])

    return (
        <div 
            className={`streamController ${visible ? "streamController--visible" : ""} ${isActive ? "streamController--active" : ""}`}
            onMouseEnter={() => setIsHoverInNavigationCircle(true)} 
            onMouseLeave={() => setIsHoverInNavigationCircle(false)} 
            onClick={() => setIsActive(prev => !prev)}
            style={{ transition: `all .3s cubic-bezier(1, 0, 0, 1) , bottom .3s ${transitionDelay}s` }}>
            <StreamControllerDayName 
                currentDay={currentDay}
                currentMonth={currentMonth}
                isActive={isActive} />
            <StreamControllerNavigator
                isActive={isActive}
                currentDay={currentDay}
                goTodayHandler={goToday}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
            />
        </div>
    )
}


export default StreamController;