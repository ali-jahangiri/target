import { useEffect, useState } from "react";
import { selfClearTimeout } from "../utils";

const Loading = ({ children , loading , renderImmediately }) => {
    const [isReadyToRenderChildren, setIsReadyToRenderChildren] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    useEffect(() => {
        if(!loading && !renderImmediately) {
            selfClearTimeout(() => {
                setIsReadyToRenderChildren(true);
            } , 1000)
        }else if(renderImmediately) {
            selfClearTimeout(() => {
                setIsReadyToRenderChildren(true)
            } , 100)
        }
    } , [loading , renderImmediately]);
    
    return (
        <>
            <div className={`loading ${isReadyToRenderChildren ? "loading--hide" : ""} ${isOverlayOpen ? "loading--overlayOpen" : ""}`}> 
                <span onClick={() => setIsOverlayOpen(prev => !prev)}>*</span>
            </div>
            {children(isReadyToRenderChildren)}
        </>
    )
}


export default Loading;