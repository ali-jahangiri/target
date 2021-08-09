// import Persian from "persian-date";
// import { useLayoutEffect } from "react";
// import { useRef } from "react";
// import { fixNumbers, selfClearTimeout } from "../utils";


// import LoadingPage from "../Pages/LoadingPage";

// import { useState } from "react";
// import ScheduleSettingCircle from "../components/ScheduleSettingCircle";

// import { Today } from ".";

// const Playground = () => {
//     const now = new Persian();
//     const [currentMonth, setCurrentMonth] = useState(0);

//     const allDays = new Array(now.add("month", currentMonth).daysInMonth()).fill(1);
//     const nthDayOfMonth = now.date();
//     const containerRef = useRef()
//     const currentLeftPosition = useRef((nthDayOfMonth - 1) * window.innerWidth)
//     const [rotate, setRotate] = useState(0);

//     const [hoveringOnNavigatorCircle, setHoveringOnNavigatorCircle] = useState(false);

//     const [loading, setLoading] = useState(true);

//     const [currentDay, setCurrentDay] = useState(currentLeftPosition.current / window.innerWidth )
    
//     let hover = hoveringOnNavigatorCircle;
//     const scrollHandler = left => (isHover => {
//         console.log('isHover' , isHover);
//         containerRef.current?.scroll({ left , behavior : "smooth"})
//         setCurrentDay(left / window.innerWidth)
//     })(hover)
    
//     const circleRotateHandler = e => {
//         if(!e) return setRotate(0)
//         setRotate(prev => prev < e ? prev - 90 : prev + 90)
//     }


//     const onWheelHandler = e => {
//         if(hoveringOnNavigatorCircle) {
//             circleRotateHandler(currentLeftPosition.current)
//             if(e.deltaY > 0 && currentLeftPosition.current < window.innerWidth * allDays.length) {  
//                 currentLeftPosition.current += window.innerWidth
//                 scrollHandler(currentLeftPosition.current)
//             }else if(currentLeftPosition.current > 0) {
//                 currentLeftPosition.current -= window.innerWidth
//                 scrollHandler(currentLeftPosition.current)
//             }
//         }
//     }

//     useLayoutEffect(() => {
//         selfClearTimeout(() => {
//             containerRef.current?.scroll({ left : currentLeftPosition.current , behavior : "smooth" })
//         } , 500)
//     } , [])

//     const renderScheduleChecker = index => {
//         let min = currentDay - 2
//         let max = currentDay + 2;

//         if(index >= min && index <= max) {
//             return <Today 
//                         sideBarEnabled={index === currentDay} 
//                         date={fixNumbers(`${now.year()}${now.month() +  currentMonth}${index+1}`)} />
//         }else return null

//     }

//     return !loading ? <LoadingPage /> : (
//         <div onWheel={onWheelHandler} ref={containerRef} style={{ display : "flex" }} className="mainContainer">
//             {
//                 allDays.map((el , i) => (
//                     <div key={i} className="__dayContainer">
//                         <div data-id={i} className={`__innerContainer ${i === currentDay  ? "__innerContainer--active" : "__innerContainer--deActive"}`}>
//                             {renderScheduleChecker(i)}
//                         </div>
//                     </div>
//                 ))
//             }
//             <ScheduleSettingCircle 
//                 currentDay={currentDay + 1} 
//                 setIsHoverInNavigationCircle={setHoveringOnNavigatorCircle} 
//                 setCurrentMonth={setCurrentMonth} 
//                 currentMonth={currentMonth} 
//                 rotate={rotate} />
//         </div>
//     )
// }



// export default Playground;

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import GridLayout from "react-grid-layout";



const Test = () => {
    const layout = [
        {i: 'b', x: 1, y: 0, w: 1, h: 2,  },
        {i: 'a', x: 2, y: 0, w: 1, h: 2,  }, 
        {i: 'c', x: 4, y: 0, w: 1, h: 2 , maxH : 100 }
    ];
    return (
        <div style={{ background : "white" , minHeight : "100vh" }}>
            <GridLayout cols={1} width={1200} onLayoutChange={console.log} className="layout" layout={layout}rowHeight={30}>
                <div style={{ background : "lightblue"}} key="a">a</div>
                <div style={{ background : "green"}} key="b">b</div>
                <div style={{ background : "green"}} key="c">c</div>
            </GridLayout>
        </div>
    )
}


export default Test;