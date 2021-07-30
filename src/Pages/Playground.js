import Persian from "persian-date";
import { useLayoutEffect } from "react";
import { useRef } from "react";
import { fetchLooper, fixNumbers, selfClearTimeout } from "../utils";


import LoadingPage from "../Pages/LoadingPage";

import { useState } from "react";
import ScheduleSettingCircle from "../components/ScheduleSettingCircle";

import { Today } from ".";
import { useEffect } from "react";
import { references } from "../firebase";


const Playground = () => {
    const now = new Persian();
    const [currentMonth, setCurrentMonth] = useState(0);

    const allDays = new Array(now.add("month", currentMonth).daysInMonth()).fill(1);
    // const allDays = new Array(5).fill(1);
    const nthDayOfMonth = now.date();
    const containerRef = useRef()
    const currentLeftPosition = useRef((nthDayOfMonth - 1) * window.innerWidth)
    const [rotate, setRotate] = useState(0);

    const [hoveringOnNavigatorCircle, setHoveringOnNavigatorCircle] = useState(false);

    const [loading, setLoading] = useState(true);

    const [currentDay, setCurrentDay] = useState(currentLeftPosition.current / window.innerWidth )
    
    const scrollHandler = left => {
        // containerRef.current?.scroll({ left , behavior : "smooth"})
        // setCurrentDay(left / window.innerWidth)
    }
    
    const handler = e => {
        if(!e) return setRotate(0)
        setRotate(prev => prev < e ? prev - 90 : prev + 90)
    }


    console.log(currentDay , currentMonth);

    const currentDate = `${now.year()}/${currentMonth + 1 }/${currentDay + 1}`

    // useEffect(() => {
    //     references.habitPerWeek
    //         .get()
    //         .then(data => {
    //             const res = fetchLooper(data);
    //             console.log(res);
    //             console.log(res , "data");
    //             const dayName = new Persian([now.year() , now.month() +  currentMonth , currentDay + 1 ]).format('dddd')
    //             console.log(dayName);
    //             console.log(res.map(el => {
    //                 return el[dayName] 
    //             }));
    //         })
    // } , [currentDate])

    useLayoutEffect(() => {
        selfClearTimeout(() => {
            containerRef.current?.scroll({ left : currentLeftPosition.current , behavior : "smooth" })
        } , 500)
        window.addEventListener("wheel" , e => {
            if(hoveringOnNavigatorCircle) {
                handler(currentLeftPosition.current)
                if(e.deltaY > 0 && currentLeftPosition.current < window.innerWidth * allDays.length) {  
                    currentLeftPosition.current += window.innerWidth
                    scrollHandler(currentLeftPosition.current)
                }else if(currentLeftPosition.current > 0) {
                    currentLeftPosition.current -= window.innerWidth
                    scrollHandler(currentLeftPosition.current)
                }
            }
            })
    } , [containerRef])

    const renderScheduleChecker = index => {
        let min = currentDay - 2
        let max = currentDay + 2;

        if(index >= min && index <= max) {
            return <Today sideBarEnabled={index === currentDay} date={fixNumbers(`${now.year()}${now.month() +  currentMonth}${index+1}`)} />
        }else return null

    }

    return !loading ? <LoadingPage /> : (
        <div ref={containerRef} style={{ display : "flex" }} className="mainContainer">
            {
                allDays.map((el , i) => (
                    <div key={i} className="__dayContainer">
                        <div data-id={i} className={`__innerContainer ${i === currentDay  ? "__innerContainer--active" : "__innerContainer--deActive"}`}>
                            <p style={{ fontSize : "5rem" , position : "absolute" , left : 0}}> {i + 1}</p>
                            {renderScheduleChecker(i)}
                        </div>
                    </div>
                ))
            }
            <ScheduleSettingCircle setIsHoverInNavigationCircle={setHoveringOnNavigatorCircle} setCurrentMonth={setCurrentMonth} currentMonth={currentMonth} rotate={rotate} />
        </div>
    )
}



export default Playground;