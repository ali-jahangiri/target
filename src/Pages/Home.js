import { useCallback, useEffect, useLayoutEffect , useRef , useState } from "react";

import { debounce , _date } from "../utils";

import StreamController from "../components/StreamController";
import Stream from "../components/Stream/Stream";
import Portal from "../Providers/Portal/Portal";
import Menu from "../components/Menu";
import HomeWelcome from "../components/HomeWelcome";

const Home = () => {
    const now = _date();
    const containerRef = useRef()
    const currentLeftPosition = useRef((now.date() - 1) * window.innerWidth);


    const [countOfStreamChange, setCountOfStreamChange] = useState(0);
    const [isStreamControllerVisible, setIsStreamControllerVisible] = useState(false);
    const [hoveringOnNavigatorCircle, setHoveringOnNavigatorCircle] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(1);
    const [currentDay, setCurrentDay] = useState(currentLeftPosition.current / window.innerWidth);
    const [streamShowUpDelay, setStreamShowUpDelay] = useState(.7)

    
    const allMonthDay = new Array(now.clone().daysInMonth()).fill(1);

    const clearScrollCountHandler = useCallback(debounce(() => {
        setCountOfStreamChange(0)
    } , countOfStreamChange >= 3 ? 2500 : 2000) , [])


    const unexpectedGapUnit = 0;

    const scrollHandler = left => {
      containerRef.current?.scroll({ left : left + unexpectedGapUnit , behavior : "smooth"})
      setCurrentDay(left / window.innerWidth);
      clearScrollCountHandler();
    }

    const comeBackToTodayHandler = () => {
        let s = (now.date() - 1) * window.innerWidth;
        setCurrentDay(s / window.innerWidth );
        currentLeftPosition.current = s
        containerRef.current?.scroll({ left : s })
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
                scrollHandler(currentLeftPosition.current);
            }
        }
    }

    useLayoutEffect(function scrollToCurrentDayHandlerInInitial () {
        containerRef.current?.scroll({ left : currentLeftPosition.current + unexpectedGapUnit })
    } , [isStreamControllerVisible]);

    useEffect(function delayOfShowUpStreamAfterScrollHandler () {
        if(countOfStreamChange >= 3) setStreamShowUpDelay(3)
        else setStreamShowUpDelay(.7)
    } , [countOfStreamChange]);

    const renderStreamChecker = index => {
        let min = currentDay - 2
        let max = currentDay + 2;

        let passMoth = now.month() + currentMonth;
        let passDay = index + 1; // increment by 1 because index number start from zero;

        const dateForPassingIntoStream = `${now.year()}/${passMoth < 10 ? `0${passMoth}` : passMoth}/${passDay < 10 ? `0${passDay}` : passDay}`
        
        const todayDate = now.format('YYYY/MM/DD');
        const isNextDayAfterToday = _date(todayDate).diff(dateForPassingIntoStream) < 0;
        const isToday = _date(todayDate).diff(dateForPassingIntoStream) === 0;
        const isPreviousDay = !isToday && !isNextDayAfterToday;

        if(index >= min && index <= max) {
            return <Stream
                        parentNodeRef={containerRef}
                        isToday={isToday}
                        isDisable={isPreviousDay}
                        isNextDayAfterToday={isNextDayAfterToday}
                        setIsStreamControllerVisible={setIsStreamControllerVisible}
                        date={dateForPassingIntoStream.split("/").join('')} />
        }else return null;

    }

    
    return (
        <Menu renderImmediately>
            {() => (
                <div onWheel={onWheelHandler} ref={containerRef} className="home">
                    <HomeWelcome />
                    {
                        allMonthDay.map((_ , i) => (
                            <div key={i} className="home__day">
                                <div
                                    style={{ transitionDelay : `${streamShowUpDelay}s` }}
                                    className={`home__day__animeHelperContainer ${i === currentDay  ? "home__day__animeHelperContainer--active" : "home__day__animeHelperContainer--deActive"}`}>
                                    {renderStreamChecker(i)}
                                </div>
                            </div>
                        ))
                    }
                <Portal>
                    <StreamController
                        visible={isStreamControllerVisible}
                        goToday={comeBackToTodayHandler}
                        currentDay={currentDay + 1}
                        setIsHoverInNavigationCircle={setHoveringOnNavigatorCircle}
                        setCurrentMonth={setCurrentMonth} 
                        currentMonth={currentMonth} />
                </Portal>
            </div>
            )}
        </Menu>
    )
}

export default Home;