import Persian from "persian-date";
import { useLayoutEffect } from "react";
import { useRef } from "react";
import { fixNumbers, selfClearTimeout } from "../utils";


import LoadingPage from "../Pages/LoadingPage";

import { useState } from "react";
import ScheduleSettingCircle from "../components/ScheduleSettingCircle";

import { Today } from ".";

const Playground = () => {
    const now = new Persian();
    const [currentMonth, setCurrentMonth] = useState(0);

    const allDays = new Array(now.add("month", currentMonth).daysInMonth()).fill(1);
    const nthDayOfMonth = now.date();
    const containerRef = useRef()
    const currentLeftPosition = useRef((nthDayOfMonth - 1) * window.innerWidth)
    const [rotate, setRotate] = useState(0);

    const [hoveringOnNavigatorCircle, setHoveringOnNavigatorCircle] = useState(false);

    const [loading, setLoading] = useState(true);

    const [currentDay, setCurrentDay] = useState(currentLeftPosition.current / window.innerWidth )
    
    let hover = hoveringOnNavigatorCircle;
    const scrollHandler = left => (isHover => {
        console.log('isHover' , isHover);
        containerRef.current?.scroll({ left , behavior : "smooth"})
        setCurrentDay(left / window.innerWidth)
    })(hover)
    
    const circleRotateHandler = e => {
        if(!e) return setRotate(0)
        setRotate(prev => prev < e ? prev - 90 : prev + 90)
    }


    const onWheelHandler = e => {
        if(hoveringOnNavigatorCircle) {
            circleRotateHandler(currentLeftPosition.current)
            if(e.deltaY > 0 && currentLeftPosition.current < window.innerWidth * allDays.length) {  
                currentLeftPosition.current += window.innerWidth
                scrollHandler(currentLeftPosition.current)
            }else if(currentLeftPosition.current > 0) {
                currentLeftPosition.current -= window.innerWidth
                scrollHandler(currentLeftPosition.current)
            }
        }
    }

    useLayoutEffect(() => {
        selfClearTimeout(() => {
            containerRef.current?.scroll({ left : currentLeftPosition.current , behavior : "smooth" })
        } , 500)
    } , [])

    const renderScheduleChecker = index => {
        let min = currentDay - 2
        let max = currentDay + 2;

        if(index >= min && index <= max) {
            return <Today 
                        sideBarEnabled={index === currentDay} 
                        date={fixNumbers(`${now.year()}${now.month() +  currentMonth}${index+1}`)} />
        }else return null

    }

    return !loading ? <LoadingPage /> : (
        <div onWheel={onWheelHandler} ref={containerRef} style={{ display : "flex" }} className="mainContainer">
            {
                allDays.map((el , i) => (
                    <div key={i} className="__dayContainer">
                        <div data-id={i} className={`__innerContainer ${i === currentDay  ? "__innerContainer--active" : "__innerContainer--deActive"}`}>
                            {renderScheduleChecker(i)}
                        </div>
                    </div>
                ))
            }
            <ScheduleSettingCircle 
                currentDay={currentDay + 1} 
                setIsHoverInNavigationCircle={setHoveringOnNavigatorCircle} 
                setCurrentMonth={setCurrentMonth} 
                currentMonth={currentMonth} 
                rotate={rotate} />
        </div>
    )
}



export default Playground;