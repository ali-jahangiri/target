import { useLayoutEffect, useMemo, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const percentTextValueHandler = percent => {
    if(percent <= 20) return "It has just started";
    else if(percent <= 37) return "Cross the initial section";
    else if(percent <= 50) return "Reach the half";
    else if(percent <= 75) return "Pass the half";
    else if(percent <= 87) return "Cross the final section";
    else if(percent <= 95) return "Almost Done";
    else return "Completed"
}

const StreamOverHour = ({ startPoint , endPoint , isInDetailsMode = false , setIsInProgress , shouldGetMinHight }) => {
    const currentHr = new Date().getHours()
    const [currentHeight, setCurrentHeight] = useState(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666));
    const [isInInitialRender, setIsInInitialRender] = useState(true);
    
    const containerRef = useRef()

    // helper checker
    const isOverAndFully = currentHeight > endPoint;
    const isNotStartedYet = startPoint > currentHeight;
    const isInDoing = !isOverAndFully && !isNotStartedYet;
    
    useLayoutEffect(() => {
        // // come back in progress and active
        // setIsInInitialRender(false)
    } , [startPoint]);

    useEffect(() => {
        let timer = setInterval(() => {
            const currentHr = new Date().getHours()
            setCurrentHeight(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666))
        } , 60000)
        return () => clearInterval(timer);
    } , []);

    useEffect(function visualHelperHandler() {
        
        // NOTE lets parent know this stream is in progress and need to scroll into it
        if(isNotStartedYet || isInDoing) {
            setIsInProgress({
                isInDoing,
                startPointPosition : startPoint / 100,
            });
        }
    } , [startPoint, currentHeight]);

    
    let percent = useMemo(() => {
        return Math.ceil((((currentHeight + 1) - startPoint) / ((endPoint - startPoint))) * 100)
    } , [currentHeight, endPoint, startPoint])
    
    return (
        <div
            ref={containerRef}
            style={{ height : (isNotStartedYet || shouldGetMinHight) ? 0 : (currentHeight + 1) - startPoint }} 
            className={`streamOverHour ${isInInitialRender ? "streamOverHour--initialRender" : ""} ${isInDetailsMode ? "streamOverHour--hide" : ""} ${isOverAndFully ? "streamOverHour--fullyCompleted" : ""}`}>
                <div className="streamOverHour__rotatedLineContainer"></div>
                <div className="streamOverHour__helperText">
                    <p>{percentTextValueHandler(percent)}</p>
                </div>
        </div>
    )
}


export default StreamOverHour;