import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const StreamOverHour = ({ startPoint , endPoint , isInDetailsMode , setIsInProgress}) => {
    const currentHr = new Date().getHours()
    const [currentHeight, setCurrentHeight] = useState(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666));
    const [currentHelperText, setCurrentHelperText] = useState("");
    
    const containerRef = useRef()

    useEffect(() => {
        let timer = setInterval(() => {
            const currentHr = new Date().getHours()
            setCurrentHeight(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666))
        } , 60000)
        return () => clearInterval(timer);
    } , []);

    useEffect(() => {
        if((endPoint - currentHeight) <= 50) setCurrentHelperText('Almost Done !');
        else if((endPoint - currentHeight) <= (endPoint / 2)) setCurrentHelperText("Pass The Half !");
        else setCurrentHelperText("Beginning !")

        if(startPoint < currentHeight) {
            setIsInProgress(containerRef?.current);
        }
    } , [currentHeight])

    return (
        <div
            ref={containerRef}
            style={{ height : startPoint > currentHeight ? 0 : (currentHeight + 1) - startPoint }} 
            className={`streamOverHour ${isInDetailsMode ? "streamOverHour--hide" : ""} ${currentHeight > endPoint ? "streamOverHour--fullyCompleted" : ""}`}>
                <div className="streamOverHour__rotatedLineContainer"></div>
                <div className="streamOverHour__helperText">
                    <p>{currentHelperText}</p>
                </div>
        </div>
    )
}


export default StreamOverHour;