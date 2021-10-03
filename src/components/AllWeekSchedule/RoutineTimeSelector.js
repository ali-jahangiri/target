import { Resizable } from "re-resizable";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { AiOutlineCaretRight , AiOutlineCaretLeft} from "react-icons/ai"
import { colors, selfClearInterval } from "../../utils";
import Input from "../Input";


const RoutineTimeSelector = ({ setIsValidToCreateRoutine }) => {
    const [routineName, setRoutineName] = useState("")
    const [currentResizablePosition, setCurrentResizablePosition] = useState(0)
    const [currentResizableWidth, setCurrentResizableWidth] = useState(0);
    const [resizableGotTouched, setResizableGotTouched] = useState(false);
   
    const [currentBgColor, setCurrentBgColor] = useState(colors[Math.round(Math.random() * colors.length)])

    const [isHoverOnMainContainer, setIsHoverOnMainContainer] = useState(false);

    const [mainUnit, setMainUnit] = useState(0);

    const mainContainerRef = useRef();

    const onResizeStopHandler = (e, dir, ref, d) => {
        setCurrentResizableWidth(Math.ceil(Math.round(ref.getClientRects()[0].width / mainUnit) * mainUnit));
        if(!resizableGotTouched) {
            setResizableGotTouched(true)
        }
    }


    useLayoutEffect(() => {
        if(mainContainerRef.current) {
            setMainUnit(mainContainerRef.current.getClientRects()[0].width / 24);
        }
    } , [mainContainerRef.current])
    
    // useLayoutEffect(() => {
        //     let timer = selfClearInterval(() => {
            //         setCurrentBgColor(colors[Math.round(Math.random() * colors.length)]);
            //     } , 3000);
            
            //     return () => clearInterval(timer)
            // } , [])

            
    const fromHr = Math.floor(currentResizableWidth / mainUnit);
    const toHr = Math.floor(currentResizablePosition / mainUnit);
    
    console.log({ from : toHr , to : fromHr + toHr } , currentResizableWidth , currentResizablePosition);
    
    

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
            // onMouseEnter={() => setIsHoverOnMainContainer(true)} 
            // onMouseLeave={() => setIsHoverOnMainContainer(false)}
            ref={mainContainerRef}
            className="routineTimeSelector">
            <div style={{ margin : '0 25px' , paddingTop : currentResizableWidth <= 150 ? 30 : 0 , transition : ".25s" }}>
                <Resizable 
                    onResize={onResizeStopHandler}
                    // onResizeStop={onResizeStopHandler}
                    className="routineTimeSelector__resizable"
                    defaultSize={{width : 50 , height : 100}}
                    // enable={{ right : !!!(ts >= 23) && (ts + px) < 23 && true , left : true }}
                    enable={{ right : true , left : true }}
                    maxHeight={100}
                    maxWidth={"100%"}
                    // minWidth={!isHoverOnMainContainer && resizableGotTouched ? "100%" : 50 }
                    minWidth={mainUnit}
                    grid={[mainUnit , mainUnit]}
                    style={{ 
                        position : "relative" ,
                        // left : isHoverOnMainContainer ?  currentResizablePosition : 0 , 
                        left: currentResizablePosition,
                        backgroundColor : `#${currentBgColor}` }}
                >
                    <div className="routineTimeSelector__resizable__innerContainer">
                        {
                            <div onClick={() => setCurrentResizablePosition(prev => prev - mainUnit)} className="routineTimeSelector__rightPush">
                                <AiOutlineCaretLeft color="red" />
                            </div>
                        }
                        <div onClick={() => setCurrentResizablePosition(prev => prev + mainUnit)} className="routineTimeSelector__leftPush">
                            {
                                !!!(fromHr >= 23) && (fromHr + toHr) < 23 && <AiOutlineCaretRight color="red" />
                            }
                        </div>
                        <div 
                            style={{ left : currentResizableWidth < 200 ? (() => {
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
                            className={`routineTimeSelector__hour ${(() => {
                            if(resizableGotTouched) {
                                if((toHr === i || fromHr + toHr === i) || (fromHr + toHr > i && toHr < i)) {
                                    return "routineTimeSelector__hour--active"
                                }else return "routineTimeSelector__hour--deActive"
                            }
                        })()}`} 
                        key={i}>{i + 1}</div>
                    ))
                }
            </div>
        </div>
    )
}


export default RoutineTimeSelector;