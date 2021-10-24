import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import client from "../client";
import { selfClearTimeout } from "../utils";
import MenuItem from "./MenuItem";



const Menu = ({ children , loading , renderImmediately , symbolPosition }) => {
    const [isReadyToRenderChildren, setIsReadyToRenderChildren] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [currentBgColor, setCurrentBgColor] = useState("3A6351")

    const [currentActiveMenu, setCurrentActiveMenu] = useState(false);


    const { location : { pathname : currentLocation } , push : historyPush } = useHistory()

    useEffect(() => {
        if(currentActiveMenu) {
            setCurrentBgColor(currentActiveMenu.color)
        }
    } , [currentActiveMenu])

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


    const redirectionHandler = path => {
        if(path === currentActiveMenu.path) return setIsOverlayOpen(false)
        else historyPush(path);
    }

    const memoizedChildren = useMemo(() => {
        return children(isReadyToRenderChildren)
    } , [isReadyToRenderChildren , children])

    return (
        <>
            <div style={{ backgroundColor : `#${currentBgColor}` }} className={`loading ${isReadyToRenderChildren ? "loading--hide" : ""} ${symbolPosition === "right" && isReadyToRenderChildren ? "loading--symbolRight" : ""} ${isOverlayOpen ? "loading--overlayOpen" : ""}`}> 
                <span onClick={() => setIsOverlayOpen(prev => !prev)}>*</span>
                <div className="loading__menu">
                    {
                        client.menuList.map((el , i) => 
                            <MenuItem 
                                redirectionHandler={redirectionHandler} 
                                currentActiveMenu={currentActiveMenu} 
                                setCurrentActiveMenu={setCurrentActiveMenu} 
                                currentLocation={currentLocation} 
                                key={i} 
                                onHover={onChangeBgColorHandler} 
                                {...el} />)
                    }
                </div>
            </div>
            { memoizedChildren }
        </>
    )
}


export default Menu;