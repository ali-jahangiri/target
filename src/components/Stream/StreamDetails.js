import { useLayoutEffect, useState } from "react";
import { selfClearTimeout } from "../../utils";
import StreamDetailsWritable from "./StreamDetailsWritble";

const StreamDetails = ({
    style ,
    color,
    name ,
    destroyTrigger, 
}) => {
    const [uiGetCompleteInPlace, setUiGetCompleteInPlace] = useState(false);

    useLayoutEffect(() => {
        selfClearTimeout(() => {
            setUiGetCompleteInPlace(true);
        } , 600)
    } , []);

    const closeHandler = () => {
        setUiGetCompleteInPlace(false);
        selfClearTimeout(() => {
            destroyTrigger()
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
        className={`streamDetails ${uiGetCompleteInPlace ? "streamDetails--complete" : ""}`} 
        style={{ width : style.width , height : style.height , left : style.left , top : style.top , background : `#${color}` , ...(uiGetCompleteInPlace) && afterOpenStyle}}>
            <div className="streamDetails__container">
                <div className="streamDetails__bgHelper" />
                <div className="streamDetails__basic">
                    <div>
                        <p>{name}</p>
                    </div>
                    <div className="streamDetails__closeTrigger">
                        <p onClick={closeHandler}>Back</p>
                    </div>
                </div>
                <StreamDetailsWritable mainBgColor={color} showUp={uiGetCompleteInPlace} />
            </div>
        </div>
    )
}



export default StreamDetails;