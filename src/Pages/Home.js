import { useLayoutEffect , useRef , useState } from "react";
import Persian from "persian-date";

import { fixNumbers, selfClearTimeout, _date } from "../utils";

import ScheduleSettingCircle from "../components/ScheduleSettingCircle";

import Stream from "./Stream";


const Home = () => {
    const now = _date();
    const containerRef = useRef()
    const currentLeftPosition = useRef((now.date() - 1) * window.innerWidth)
    const [rotate, setRotate] = useState(0);
    
    const [hoveringOnNavigatorCircle, setHoveringOnNavigatorCircle] = useState(false);

    const [currentMonth, setCurrentMonth] = useState(1);
    const [currentDay, setCurrentDay] = useState(currentLeftPosition.current / window.innerWidth )
    const allMonthDay = new Array(now.clone().add(currentDay, "M").daysInMonth()).fill(1);
    
    // const isInDragging = useSelector(state => state.ui.isInDragging);
    
    const scrollHandler = left => {
      containerRef.current?.scroll({ left , behavior : "smooth"})
      setCurrentDay(left / window.innerWidth)
    }
    
    const circleRotateHandler = e => {
        if(!e) return setRotate(0)
        setRotate(prev => prev < e ? prev - 90 : prev + 90)
    }


    const onWheelHandler = e => {
        if(hoveringOnNavigatorCircle) {
            circleRotateHandler(currentLeftPosition.current)
            if(e.deltaY > 0 && currentLeftPosition.current < window.innerWidth * allMonthDay.length) {  
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

        let passMoth = now.month() +  currentMonth
        let passDay = index+1
        if(index >= min && index <= max) {
            return <Stream 
                        sideBarEnabled={index === currentDay} 
                        date={fixNumbers(`${now.year()}/${passMoth < 10 ? `0${passMoth}` : passMoth}/${passDay < 10 ? `0${passDay}` : passDay}`)} />
        }else return null

    }


    const goToday = () => {
        let s = (now.date() - 1) * window.innerWidth
        setCurrentDay(s / window.innerWidth );
        currentLeftPosition.current = s
        containerRef.current?.scroll({ left : s , behavior : "smooth" })
    }

    return (
        <div onWheel={onWheelHandler} ref={containerRef} style={{ display : "flex" }} className="mainContainer">
            {
                allMonthDay.map((_ , i) => (
                    <div key={i} className={`__dayContainer ${i === currentDay && false ? "__dayContainer--scrollDisabled" : ""}`}>
                        <div 
                          data-id={i} 
                          className={`__innerContainer ${i === currentDay  ? "__innerContainer--active" : "__innerContainer--deActive"}`}>
                            {renderScheduleChecker(i)}
                        </div>
                    </div>
                ))
            }
            <ScheduleSettingCircle
                goToday={goToday}
                currentDay={currentDay + 1} 
                setIsHoverInNavigationCircle={setHoveringOnNavigatorCircle} 
                setCurrentMonth={setCurrentMonth} 
                currentMonth={currentMonth} 
                rotate={rotate} />
        </div>
    )
}



export default Home;