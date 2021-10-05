import { Resizable } from "re-resizable";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { AiOutlineCaretRight , AiOutlineCaretLeft} from "react-icons/ai"
import { colors, selfClearInterval } from "../../utils";
import Input from "../Input";


const RoutineTimeSelector = ({ setIsValidToCreateRoutine , routineList }) => {
    const [routineName, setRoutineName] = useState("")
    const [currentResizablePosition, setCurrentResizablePosition] = useState(0)
    const [currentResizableWidth, setCurrentResizableWidth] = useState(0);
    const [resizableGotTouched, setResizableGotTouched] = useState(false);
    const [currentBgColor, setCurrentBgColor] = useState(colors[Math.round(Math.random() * colors.length)])
    const [isHoverOnMainContainer, setIsHoverOnMainContainer] = useState(false);
    const [mainUnit, setMainUnit] = useState(0);
    const mainContainerRef = useRef();
    const [isInResizeProcess, setIsInResizeProcess] = useState(false);


    const onResizeStopHandler = (e, dir, ref, d) => {
        setCurrentResizableWidth(Math.ceil(Math.round(ref.getClientRects()[0].width / mainUnit) * mainUnit));
        if(!resizableGotTouched) {
            setResizableGotTouched(true)
        }
    }


    useLayoutEffect(function calculateMainUnit() {
        if(mainContainerRef.current) {
            setMainUnit(mainContainerRef.current.getClientRects()[0].width / 24);
        }
    } , [mainContainerRef])
    

    useLayoutEffect(() => {
        let timer = selfClearInterval(() => {
            setCurrentBgColor(colors[Math.round(Math.random() * colors.length)]);
        } , 3000);
            
        return () => clearInterval(timer)
    } , [])

            
    const fromHr = Math.floor(currentResizableWidth / mainUnit);
    const toHr = Math.floor(currentResizablePosition / mainUnit);


    useEffect(() => {
        if(routineName) {
            setIsValidToCreateRoutine({
                name : routineName,
                hour : {
                    from : toHr,
                    to : fromHr + toHr
                },
                color : currentBgColor
            })
        }else setIsValidToCreateRoutine(false);
    } , [routineName , currentResizableWidth , currentResizablePosition])


    useEffect(function blockOverWidthHandle() {
        if((fromHr + toHr) > 23) {
            setCurrentResizablePosition(prev => prev + (mainUnit * (24 - (fromHr + toHr))))
        }
    } , [currentResizableWidth])


    return ( 
        <div 
            onMouseEnter={setIsHoverOnMainContainer} 
            onMouseLeave={() => setIsHoverOnMainContainer(false)}
            ref={mainContainerRef}
            className="routineTimeSelector">
            <div style={{ margin : '0 25px' , paddingTop : currentResizableWidth <= 150 ? 30 : 0 , transition : ".25s" }}>
                <Resizable
                    onResizeStart={setIsInResizeProcess}
                    onResizeStop={() => setIsInResizeProcess(false)}
                    onResize={onResizeStopHandler}
                    className="routineTimeSelector__resizable"
                    defaultSize={{width : 50 , height : 100}}
                    enable={{ right : true , left : true }}
                    maxHeight={100}
                    maxWidth={"100%"}
                    minWidth={!isHoverOnMainContainer ? "100%" : mainUnit}
                    grid={[mainUnit , mainUnit]}
                    style={{ 
                        left : isHoverOnMainContainer ?  currentResizablePosition : 0 ,
                        transition: !isInResizeProcess ? ".3s" : "0s",
                        backgroundColor : `#${currentBgColor}`
                    }}>
                    <div className="routineTimeSelector__resizable__innerContainer">
                        {
                            <div onClick={() => setCurrentResizablePosition(prev => prev - mainUnit)} className="routineTimeSelector__rightPush">
                                <AiOutlineCaretLeft />
                            </div>
                        }
                        <div onClick={() => setCurrentResizablePosition(prev => prev + mainUnit)} className="routineTimeSelector__leftPush">
                            {
                                !!!(fromHr >= 23) && (fromHr + toHr) < 23 && <AiOutlineCaretRight />
                            }
                        </div>
                        <div
                            style={{ left : !isHoverOnMainContainer ? 0 : currentResizableWidth < 200 ? (() => {
                                if(currentResizableWidth < 100) {
                                    return currentResizableWidth * 2
                                }else return currentResizableWidth / 2.5
                            })() : 0 }}
                            className={`routineTimeSelector__routeNameContainer ${currentResizableWidth <= 150 ? "routineTimeSelector__routeNameContainer--goTop" : ""}`}>
                            <Input value={routineName} placeholder="Routine Name" onChange={setRoutineName} />
                        </div>
                        </div>
                </Resizable>
            </div>
            <div className="routineTimeSelector__hourContainer">
                {
                    new Array(24).fill("").map((_ , i) => (
                        <div
                            style={{
                                maxWidth : mainUnit,
                                minWidth : mainUnit,
                                flex: isHoverOnMainContainer ? `1 0 ${mainUnit}px` : (toHr === i || fromHr + toHr === i) || (fromHr + toHr > i && toHr < i) ? `1 0 ${mainUnit}px` : '0 0 0',
                            }}
                            className={`routineTimeSelector__hour ${(() => {
                            if(resizableGotTouched) {
                                if((toHr === i || fromHr + toHr === i) || (fromHr + toHr > i && toHr < i)) {
                                    return "routineTimeSelector__hour--active"
                                }else return "routineTimeSelector__hour--deActive"
                            }
                        })()}`} 
                        key={i}>{i + 1}
                        </div>
                    ))
                }
            </div>
            <div className="routineTimeSelector__previousRoutineContainer">
                {
                    routineList.map((el , i) => (
                        <div style={{ 
                            backgroundColor : `#${el.color}` , 
                            width: ((el.hour.to + 1) - (el.hour.from + 1)) * mainUnit,
                            left: (el.hour.from + 0) * mainUnit
                        }} 
                        key={i}>
                            <p><span>Settled as : </span> {el.name}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


export default RoutineTimeSelector;