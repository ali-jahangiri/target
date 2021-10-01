import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";

import { AiOutlineCaretRight , AiOutlineCaretLeft} from "react-icons/ai"
import Input from "../Input";


const RoutineTimeSelector = ({ setIsValidToCreateRoutine }) => {
    const [routineName, setRoutineName] = useState("")
    const [currentResizablePosition, setCurrentResizablePosition] = useState(0)
    const [currentResizableWidth, setCurrentResizableWidth] = useState(0);
    const [resizableGotTouched, setResizableGotTouched] = useState(false);
   
    const [isHoverOnMainContainer, setIsHoverOnMainContainer] = useState(false);

    const onResizeStopHandler = (e, dir, ref, d) => {
        setCurrentResizableWidth(ref.getClientRects()[0].width);
        if(!resizableGotTouched) {
            setResizableGotTouched(true)
        }
    }


    const ts = Math.round(currentResizableWidth / 50) 
    const px = currentResizablePosition / 50

    console.log(`from ${px} to ${ts + px}`);
    
    useEffect(() => {
        if(routineName) {
            setIsValidToCreateRoutine({
                name : routineName,
                hour : {
                    from : px,
                    to : ts + px
                }
            })
        }else {
            setIsValidToCreateRoutine(false)
        }
    } , [routineName , currentResizableWidth , currentResizablePosition])


    return ( 
        <div onMouseEnter={() => setIsHoverOnMainContainer(true)} onMouseLeave={() => setIsHoverOnMainContainer(false)} className="routineTimeSelector">
            <div style={{ margin : '0 25px' }}>
                <Resizable
                    onResize={onResizeStopHandler}
                    className="routineTimeSelector__resizable"
                    defaultSize={{width : 50 , height : 100}}
                    enable={{ right : !!!(ts >= 23) && (ts + px) < 23 && true , left : true }}
                    maxHeight={100}
                    maxWidth={1200}
                    minWidth={!isHoverOnMainContainer && resizableGotTouched ? "100%" : 50 }
                    grid={[50 , 50]}
                    style={{ position : "relative" , left : isHoverOnMainContainer ?  currentResizablePosition : 0 , transition : ".2s"}}
                >
                    <div className="routineTimeSelector__resizable__innerContainer">
                        {
                            !!(px) && <div onClick={() => setCurrentResizablePosition(prev => prev - 50)} className="routineTimeSelector__rightPush">
                                <AiOutlineCaretLeft />
                            </div>
                        }
                        <div onClick={() => setCurrentResizablePosition(prev => prev + 50)} className="routineTimeSelector__leftPush">
                            {
                                !!!(ts >= 23) && (ts + px) < 23 && <AiOutlineCaretRight />
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
                        <div className={`routineTimeSelector__hour ${(() => {
                            const startPoint = currentResizablePosition / 50;
                            const endPoint = startPoint + Math.round(currentResizableWidth) / 50;
                            if(resizableGotTouched) {
                                if((startPoint === i || endPoint === i) || (endPoint > i && startPoint < i)) {
                                    return "routineTimeSelector__hour--active"
                                }else return "routineTimeSelector__hour--deActive"
                            }
                        })()}`} key={i}>{i + 1}</div>
                    ))
                }
            </div>
        </div>
    )
}


export default RoutineTimeSelector;