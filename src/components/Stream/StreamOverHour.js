import { useMemo, useRef , useEffect , useState } from "react";
import { percentTextValueHandler } from "../../utils";

const StreamOverHour = ({ 
    startPoint , 
    endPoint , 
    isInDetailsMode = false , 
    setIsInProgress , 
    shouldGetMinHight ,
}) => {
    const currentHr = new Date().getHours();
    const [currentHeight, setCurrentHeight] = useState(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666));
    const containerRef = useRef();
    
    
    // helper checker
    const isOverAndFully = currentHeight > endPoint;
    const isNotStartedYet = startPoint > currentHeight;
    const isInDoing = !isOverAndFully && !isNotStartedYet;
    
    useEffect(function updatingPositionEveryMin() {
        let timer = setInterval(() => {
            const currentHr = new Date().getHours();
            setCurrentHeight(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666))
        } , 60000);
        return () => clearInterval(timer);
    } , []);

    useEffect(function visualHelperHandler() {
        // NOTE lets parent know this stream is in progress and need to scroll into it , we grab items that we don't pass them by current hour
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
            className={`streamOverHour  ${isInDetailsMode ? "streamOverHour--hide" : ""} ${isOverAndFully ? "streamOverHour--fullyCompleted" : ""}`}>
                <div className="streamOverHour__rotatedLineContainer"></div>
                {
                    (currentHeight + 1) - startPoint >= 30 && <div className="streamOverHour__helperText">
                        <p>{percentTextValueHandler(percent)}</p>
                    </div>
                }
        </div>
    )
}


export default StreamOverHour;