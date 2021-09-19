import { useEffect, useState } from "react";
import { selfClearTimeout } from "../utils";
import MenuItem from "./MenuItem";

const menuList = [
    {
        name : "Stream",
        path : "/",
        color : "865858"
    },
    {
        name : "Target",
        path : "/target",
        color : "889EAF"
    },
    {
        name : "Profile",
        path : "/profile",
        color : "7F8B52"
    }
]

const Loading = ({ children , loading , renderImmediately }) => {
    const [isReadyToRenderChildren, setIsReadyToRenderChildren] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const [currentBgColor, setCurrentBgColor] = useState("3A6351")
    
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
    

    const onChangeBgColorHandler = bgColor => setCurrentBgColor(bgColor)


    return (
        <>
            <div style={{ backgroundColor : `#${currentBgColor}` }} className={`loading ${isReadyToRenderChildren ? "loading--hide" : ""} ${isOverlayOpen ? "loading--overlayOpen" : ""}`}> 
                <span onClick={() => setIsOverlayOpen(prev => !prev)}>*</span>
                <div className="loading__menu">
                    {
                        menuList.map((el , i) => <MenuItem key={i} onHover={onChangeBgColorHandler} {...el} />)
                    }
                </div>
            </div>
            {children(isReadyToRenderChildren)}
        </>
    )
}


export default Loading;