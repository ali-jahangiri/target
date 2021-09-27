import { useCallback, useEffect, useLayoutEffect , useRef , useState } from "react";

import { debounce,  _date } from "../utils";

import ScheduleSettingCircle from "../components/ScheduleSettingCircle";
import Stream from "./Stream";
import Portal from "../Providers/Portal/Portal";

const Home = () => {
    const now = _date();
    const containerRef = useRef()
    const currentLeftPosition = useRef((now.date() - 1) * window.innerWidth)
    const [countOfStreamChange, setCountOfStreamChange] = useState(0);
    

    const [isTargetStreamReadyToRender, setIsTargetStreamReadyToRender] = useState(false);

    const [hoveringOnNavigatorCircle, setHoveringOnNavigatorCircle] = useState(false);

    const [currentMonth, setCurrentMonth] = useState(1);
    const [currentDay, setCurrentDay] = useState(currentLeftPosition.current / window.innerWidth);
    
    const [streamShowUpDelay, setStreamShowUpDelay] = useState(.7)
    
    const allMonthDay = new Array(now.clone().daysInMonth()).fill(1);

    const clearScrollCountHandler = useCallback(debounce(() => {
        setCountOfStreamChange(0)
    } , countOfStreamChange >= 3 ? 2500 : 2000) , [])

    const scrollHandler = left => {
      containerRef.current?.scroll({ left , behavior : "smooth"})
      setCurrentDay(left / window.innerWidth);
      clearScrollCountHandler()
    }

   


    const onWheelHandler = e => {
        if(hoveringOnNavigatorCircle) {
            
            if(e.deltaY > 0 && currentLeftPosition.current < window.innerWidth * allMonthDay.length) {  
                // Checking for being in end of the month
                if((currentDay + 1) !== allMonthDay.length) {
                    currentLeftPosition.current += window.innerWidth;
                    scrollHandler(currentLeftPosition.current);
                    setCountOfStreamChange(prev => prev + 1);
                    
                }else {
                    // Show some alert that you are in end of the month and cannot scroll more then this
                }

            }else if(currentLeftPosition.current > 0) {
                setCountOfStreamChange(prev => prev + 1);
                currentLeftPosition.current -= window.innerWidth;
                scrollHandler(currentLeftPosition.current)
            }
        }
    }

    useLayoutEffect(() => {
        containerRef.current?.scroll({ left : currentLeftPosition.current })
    } , [isTargetStreamReadyToRender]);

    const renderScheduleChecker = index => {
        let min = currentDay - 2
        let max = currentDay + 2;

        let passMoth = now.month() +  currentMonth
        let passDay = index + 1;

        const dateForPassingIntoStream = `${now.year()}/${passMoth < 10 ? `0${passMoth}` : passMoth}/${passDay < 10 ? `0${passDay}` : passDay}`
        
        if(index >= min && index <= max) {
            return <Stream
                        setIsTargetStreamReadyToRender={setIsTargetStreamReadyToRender}
                        sideBarEnabled={index === currentDay} 
                        date={dateForPassingIntoStream} />
        }else return null

    }


    const goToday = () => {
        let s = (now.date() - 1) * window.innerWidth
        setCurrentDay(s / window.innerWidth );
        currentLeftPosition.current = s
        containerRef.current?.scroll({ left : s , behavior : "smooth" })
    }


    useEffect(() => {
        if(countOfStreamChange >= 3) {
            setStreamShowUpDelay(2)
        }else {
            setStreamShowUpDelay(.7)
        }
    } , [countOfStreamChange]);

    return (
        <div onWheel={onWheelHandler} ref={containerRef} style={{ display : "flex" }} className="mainContainer">
            {
                allMonthDay.map((_ , i) => (
                    <div key={i} className={`__dayContainer ${i === currentDay && false ? "__dayContainer--scrollDisabled" : ""}`}>
                        <div
                            style={{ transitionDelay : `${streamShowUpDelay}s` }} 
                            data-id={i}
                            className={`__innerContainer ${i === currentDay  ? "__innerContainer--active" : "__innerContainer--deActive"}`}>
                            {renderScheduleChecker(i)}
                        </div>
                    </div>
                ))
            }
            <Portal>
                <ScheduleSettingCircle
                    visible={isTargetStreamReadyToRender}
                    goToday={goToday}
                    currentDay={currentDay + 1} 
                    setIsHoverInNavigationCircle={setHoveringOnNavigatorCircle} 
                    setCurrentMonth={setCurrentMonth} 
                    currentMonth={currentMonth} />
            </Portal>
        </div>
    )
}



export default Home;