import { useEffect, useState } from "react";
import { selfClearTimeout } from "../utils";

const Loading = ({ children , loading }) => {
    const [isReadyToRenderChildren, setIsReadyToRenderChildren] = useState(false);

    useEffect(() => {
        if(!loading) {
            selfClearTimeout(() => {
                setIsReadyToRenderChildren(true);
            } , 1000)
        }
    } , [loading]);
    
    return (
        <>
            <div className={`loading ${isReadyToRenderChildren ? "loading--hide" : ""}`}> 
                <span>*</span>
            </div>
            {children(isReadyToRenderChildren)}
        </>
    )
}


export default Loading;