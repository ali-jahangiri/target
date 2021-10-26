import { useEffect, useState } from "react";
import { selfClearTimeout } from "../../utils";

const StreamSideBarOverlayHelper = ({ isSidebarVisible }) => {
    const [overlayShouldGetDestroyed, setOverlayShouldGetDestroyed] = useState(false);
    const [shouldGetVisible, setShouldGetVisible] = useState(false);

    useEffect(() => {
        if(!isSidebarVisible) {
            selfClearTimeout(() => {
                setOverlayShouldGetDestroyed(true);
                setShouldGetVisible(false)
            } , 500);
        }else {
            selfClearTimeout(() => {
                setShouldGetVisible(true)
            } , 50);
        };
    } , [isSidebarVisible]);

    return !overlayShouldGetDestroyed ? <div className={`sidebarOverlayHelper ${shouldGetVisible ? "sidebarOverlayHelper--show" : ""}`} /> : null
}


export default StreamSideBarOverlayHelper;