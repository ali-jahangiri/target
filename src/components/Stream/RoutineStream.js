import React, { useEffect, useState , useRef, useLayoutEffect } from "react";
import { generateColor, selfClearTimeout } from "../../utils";
import useAfterInitialEffect from "../AllWeekSchedule/useAfterInitialEffect";
import TextareaAutosize from "react-textarea-autosize";
import RoutineStreamSpendTime from "./RoutineStreamSpendTime";
import client from "../../client";
import StreamOverHour from "./StreamOverHour";
import Portal from "../../Providers/Portal/Portal";
import ReactGridLayout from "react-grid-layout";


const RoutineStreamDesc = ({ isOtherVisionVisible , setIsDescFocused , isInSpendTime , isDescFocused , initialValue , syncHandler }) => {
    const textareaRef = useRef();
    const [value, setValue] = useState(initialValue)
    

    const blurHandler = () => {
        setIsDescFocused(false);
        syncHandler(value);
    };
    const focusHandler = () => setIsDescFocused(true);

    useLayoutEffect(()  => {
        selfClearTimeout(() => {
            if(isOtherVisionVisible) textareaRef.current?.focus();
        } , 500);
    } , []);

    return (
        <div className={`routineStream__desc ${isInSpendTime ? "routineStream__desc--getDestroy" : ""} ${isDescFocused ? "routineStream__desc--focused" : ""} ${!isOtherVisionVisible ? "routineStream__desc--hide" : ""}`}>
            <TextareaAutosize
                onFocus={focusHandler}
                onBlur={blurHandler}
                placeholder="What about this Routine ?"
                value={value}
                onChange={({ target : { value } }) => setValue(value)}
                ref={textareaRef}
            />
        </div>
    )
}


const showSpendTimePreviewTextHandler = passedSpendTime => {
    if(passedSpendTime === 100) {
        return "Completed"
    }else return `${passedSpendTime}%`
}


const RoutinePortal = ({ name ,  }) => {
    return (
        <div>

        </div>
    )
}


const RoutineCircle = ({
    clickHandler,
    color
}) => {
    return (
        <div className="routineStream__footer">
            <div onClick={clickHandler} className="routineStream__circle">
                <div style={{ backgroundColor : `#${color}` }} />
            </div>
        </div>
    )
}

const RoutineStream = ({ 
    i , 
    color , 
    name , 
    hour ,
    index , 
    habitInStream ,
    spendTime = 50,
    setIsInOtherVisionToParent,
    setPropHandler,
    desc = "",
    layout,
    isToday,
    addToActiveBlockHandler,
    setIsStreamControllerVisible,
 }) => {
    const [isDetailsEnable, setIsDetailsEnable] = useState(false);
    const [portalPosition, setPortalPosition] = useState(null);
    const [showPortal, setShowPortal] = useState(false);
    const [shouldPortalGetFull, setShouldPortalGetFull] = useState(false);
    const [spendTimeEnabled, setSpendTimeEnabled] = useState(false);
    const containerRef = useRef();


    const routineTime = hour.to - hour.from;

    const internalPassingUpCurrentInProgressBlockHandler = shouldAddBlockToList => {
        if(shouldAddBlockToList) addToActiveBlockHandler(shouldAddBlockToList);
    }


    console.log(hour);

    const showDetailsHandler = status => {
        if(status) {
          document.body.style.overflow = 'hidden';
          setIsStreamControllerVisible(false);
          setIsDetailsEnable(true);
          setPortalPosition(containerRef.current.getClientRects()[0]);
          selfClearTimeout(() => setShowPortal(true) , 500);
          selfClearTimeout(() => setShouldPortalGetFull(true) , 1000);
        }
    }

    
    const closeDetailsHandler = () => {
        setShouldPortalGetFull(false);
        selfClearTimeout(() => {
            setShowPortal(false);
            setIsDetailsEnable(false)
            setIsStreamControllerVisible(true);
            document.body.style.overflow = 'auto';
        } , 800)
    }

    const afterOpenStyle = {
        width : "100vw",
        height : "100vh",
        left : 0 , 
        top : 0
    }

    return (
        <div
            ref={containerRef}
            className="routineStream">
            <div style={{ backgroundColor : generateColor(`#${color}` , 8) , height : routineTime * 100 }}>
                <div className="routineStream__name">
                    <p onClick={showDetailsHandler}>{name}</p>
                </div>
                <div style={{ background : generateColor(`#${color}` , 9) }} className="routineStream__helperFiller"></div>
            </div>
            <RoutineCircle clickHandler={() => {}} color={color} />
            {
                isToday && <StreamOverHour
                    setIsInProgress={internalPassingUpCurrentInProgressBlockHandler} 
                    isInDetailsMode={false} 
                    startPoint={layout.y * 100} 
                    endPoint={(layout.y + layout.h) * 100}
                />
            }
            {
                showPortal && <Portal>
                    <div className={`routinePortal ${shouldPortalGetFull ? "routinePortal--complete" : ""}`} style={{ position : 'fixed' ,  left : portalPosition.left , top : portalPosition.top , width : portalPosition.width , height : portalPosition.height , zIndex : 999 , ...(shouldPortalGetFull) && afterOpenStyle , transition : ".3s"}}>
                        <div style={{ background : `#${generateColor(color , 8)}` }} className="routinePortal__container">
                            <div className="routinePortal__basic">
                                <p>{name}</p>
                                <p className="routinePortal__closeTrigger" onClick={closeDetailsHandler}>Close</p>
                            </div>
                            {
                                spendTimeEnabled && <div className="routinePortal__hourContainer">
                                    {
                                        new Array(routineTime).fill('').map((_ , i) => <div style={{ animationDelay : `${i * 90}ms` }}>{hour.from + i}</div>)
                                    }
                                </div>
                            }
                            {/* <div>
                                <ReactGridLayout
                                    cols={1}
                                    layout={[{
                                        x: 0,
                                        y: 0,
                                        w: 12,
                                        h: 5,
                                    }]}
                                >
                                    <div id="others"></div>
                                </ReactGridLayout>
                            </div> */}
                            <RoutineCircle clickHandler={() => {}} color={color} />
                        </div>
                    </div>
                </Portal>
            }
        </div>
    )
}



export default RoutineStream;