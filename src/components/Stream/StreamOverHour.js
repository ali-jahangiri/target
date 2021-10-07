import { useLayoutEffect, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import client from "../../client";


const StreamOverHour = ({ startPoint , endPoint , isInDetailsMode = false , setIsInProgress }) => {
    const currentHr = new Date().getHours()
    const [currentHeight, setCurrentHeight] = useState(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666));
    const [currentHelperText, setCurrentHelperText] = useState("");
    const [isInInitialRender, setIsInInitialRender] = useState(true);
    
    const containerRef = useRef()

    
    // helper checker
    const isOverAndFully = currentHeight > endPoint;
    const isNotStartedYet = startPoint > currentHeight;
    const isInDoing = !isOverAndFully && !isNotStartedYet;
    
    // useLayoutEffect(() => {
    //     setIsInInitialRender(false)

    // come back in progress and active
    // } , [startPoint]);

    useEffect(() => {
        let timer = setInterval(() => {
            const currentHr = new Date().getHours()
            setCurrentHeight(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666))
        } , 60000)
        return () => clearInterval(timer);
    } , []);

    useEffect(function visualHelperHandler() {
        const { ALMOST , BEGGING , HALF , DONE } = client.STATIC.overHourMessage;

        // if((endPoint - currentHeight) <= 50) setCurrentHelperText(ALMOST);
        // else if((endPoint - currentHeight) <= (endPoint / 2)) setCurrentHelperText(HALF);
        // else setCurrentHelperText(BEGGING);

        // lets parent know this stream is in progress and need to scroll into it
        if(isNotStartedYet || isInDoing) {
            setIsInProgress({
                isInDoing,
                startPointPosition : startPoint / 100,
            });
        }
    } , [startPoint, currentHeight]);

    
    return (
        <div
            ref={containerRef}
            style={{ height : isNotStartedYet ? 0 : (currentHeight + 1) - startPoint }} 
            className={`streamOverHour ${isInInitialRender ? "streamOverHour--initialRender" : ""} ${isInDetailsMode ? "streamOverHour--hide" : ""} ${isOverAndFully ? "streamOverHour--fullyCompleted" : ""}`}>
                <div className="streamOverHour__rotatedLineContainer"></div>
                <div className="streamOverHour__helperText">
                    <p>{currentHelperText}</p>
                </div>
        </div>
    )
}


export default StreamOverHour;