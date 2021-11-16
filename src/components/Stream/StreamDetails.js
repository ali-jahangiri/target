import { useLayoutEffect, useState } from "react";
import { selfClearTimeout } from "../../utils";

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
        } , 800)
    } , []);

    const closeHandler = () => {
        setUiGetCompleteInPlace(false);
        selfClearTimeout(() => {
            destroyTrigger()
        } , 500)
    }

    return (
        <div className={`streamDetails ${uiGetCompleteInPlace ? "streamDetails--complete" : ""}`} style={{ width : style.width , height : style.height , left : style.left , top : style.top , background : `#${color}`}}>
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
            </div>
        </div>
    )
}



export default StreamDetails;