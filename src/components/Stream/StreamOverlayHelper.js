import { useEffect, useState } from "react";
import { selfClearTimeout } from "../../utils";

const StreamOverlayHelper = ({ visible , onClose }) => {
    const [overlayShouldGetDestroyed, setOverlayShouldGetDestroyed] = useState(false);
    const [shouldGetVisible, setShouldGetVisible] = useState(false);

    useEffect(() => {
        if(!visible) {
            selfClearTimeout(() => {
                setOverlayShouldGetDestroyed(true);
                setShouldGetVisible(false)
            } , 300);
        }else {
            setOverlayShouldGetDestroyed(false);
            selfClearTimeout(() => {
                setShouldGetVisible(true);
            } , 200)
        }
    } , [visible]);

    return !overlayShouldGetDestroyed ? <div onClick={onClose} className={`streamOverlayHelper ${shouldGetVisible && visible ? "streamOverlayHelper--show" : visible && !shouldGetVisible ? "streamOverlayHelper--getHide" : ""}`} /> : null
}


export default StreamOverlayHelper;