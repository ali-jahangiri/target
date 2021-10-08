import { useCallback, useEffect, useLayoutEffect , useRef , useState } from "react";

import { debounce,  selfClearTimeout,  _date } from "../utils";

import ScheduleSettingCircle from "../components/ScheduleSettingCircle";
import Stream from "./Stream";
import Portal from "../Providers/Portal/Portal";
import Loading from "../components/Loading";
import WelcomeLoading from "../components/WelcomeLoading";

const Home = () => {
    const now = _date();
    const containerRef = useRef()
    const currentLeftPosition = useRef((now.date() - 1) * window.innerWidth)
    const [countOfStreamChange, setCountOfStreamChange] = useState(0);
    

    const [isTargetStreamReadyToRender, setIsTargetStreamReadyToRender] = useState(false);

    const [hoveringOnNavigatorCircle, setHoveringOnNavigatorCircle] = useState(false);

    const [currentMonth, setCurrentMonth] = useState(1);
    const [currentDay, setCurrentDay] = useState(currentLeftPosition.current / window.innerWidth);
    
    const [isWelcomeLoadingVisible, setIsWelcomeLoadingVisible] = useState(true);

    const [streamShowUpDelay, setStreamShowUpDelay] = useState(.7)
    
    const allMonthDay = new Array(now.clone().daysInMonth()).fill(1);

    const clearScrollCountHandler = useCallback(debounce(() => {
        setCountOfStreamChange(0)
    } , countOfStreamChange >= 3 ? 2500 : 2000) , [])


    const unexpectedGapUnit = 6

    const scrollHandler = left => {
      containerRef.current?.scroll({ left : left + unexpectedGapUnit , behavior : "smooth"})
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
        containerRef.current?.scroll({ left : currentLeftPosition.current + unexpectedGapUnit })
    } , [isTargetStreamReadyToRender]);

    const renderScheduleChecker = index => {
        let min = currentDay - 2
        let max = currentDay + 2;

        let passMoth = now.month() +  currentMonth
        let passDay = index + 1;

        const dateForPassingIntoStream = `${now.year()}/${passMoth < 10 ? `0${passMoth}` : passMoth}/${passDay < 10 ? `0${passDay}` : passDay}`
        
        const todayDate = _date().format('YYYY/MM/DD');
        const isTodayOrAfter = _date(todayDate).diff(dateForPassingIntoStream) <= 0 ? true : false;
        const isNextDayAfterToday = _date(todayDate).diff(dateForPassingIntoStream) < 0;
        const isToday = _date(todayDate).diff(dateForPassingIntoStream) === 0;


        if(index >= min && index <= max) {
            return <Stream
                        parentNodeRef={containerRef}
                        isToday={isToday}
                        isDisable={!isTodayOrAfter}
                        isNextDayAfterToday={isNextDayAfterToday}
                        setIsTargetStreamReadyToRender={setIsTargetStreamReadyToRender}
                        sideBarEnabled={index === currentDay} 
                        date={dateForPassingIntoStream} />
        }else return null

    }

    useLayoutEffect(() => {
        selfClearTimeout(() => {
          setIsWelcomeLoadingVisible(false);
        } , 1900);
      } , []);

    const goToday = () => {
        let s = (now.date() - 1) * window.innerWidth
        setCurrentDay(s / window.innerWidth );
        currentLeftPosition.current = s
        containerRef.current?.scroll({ left : s })
    }


    useEffect(() => {
        if(countOfStreamChange >= 3) {
            setStreamShowUpDelay(2)
        }else {
            setStreamShowUpDelay(.7)
        }
    } , [countOfStreamChange]);

    return (
        <Loading renderImmediately>
            {() => (
                <div onWheel={onWheelHandler} ref={containerRef} style={{ display : "flex" }} className="mainContainer">
                    <WelcomeLoading isInLoading={isWelcomeLoadingVisible} /> }
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
            )}
        </Loading>
    )
}



export default Home;