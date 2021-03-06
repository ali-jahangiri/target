import { useLayoutEffect, useState } from "react";
import { selfClearTimeout } from "../../utils";
import StreamDetailsWritable from "./StreamDetailsWritable";

const StreamDetails = ({
    style ,
    color,
    name ,
    desc,
    destroyTrigger,
    syncValueHandler,
    deleteHandler,
}) => {
    const [uiGetCompleteInPlace, setUiGetCompleteInPlace] = useState(false);

    useLayoutEffect(() => {
        selfClearTimeout(() => {
            setUiGetCompleteInPlace(true);
        } , 600)
    } , []);

    const closeHandler = () => {
        setUiGetCompleteInPlace(false);
        selfClearTimeout(destroyTrigger , 800);
    }

    const afterOpenStyle = {
        width : "100vw",
        height : "100vh",
        left : 0 , 
        top : 0
    }

    const innerDeleteHandler = () => {
        closeHandler()
        selfClearTimeout(deleteHandler , 800)
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
                <StreamDetailsWritable
                    deleteHandler={innerDeleteHandler}
                    value={desc} 
                    syncValueHandler={syncValueHandler} 
                    mainBgColor={color} 
                    showUp={uiGetCompleteInPlace} />
            </div>
        </div>
    )
}



export default StreamDetails;