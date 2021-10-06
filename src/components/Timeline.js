import { useEffect , useLayoutEffect, useState  } from "react";
import { selfClearTimeout } from "../utils";

const Timeline = ({ shouldGoToCurrentHour }) => {
    const currentHr = new Date().getHours()
    const [position, setPosition] = useState(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666));

    useLayoutEffect(function scrollIntoCurrentHour() {
        if(shouldGoToCurrentHour) {
            selfClearTimeout(() => {
                document.querySelector('.mainContainer').scrollTo({ top : position , behavior : "smooth" })
            } , 500)
        }
    } , []);

    useEffect(() => {
        let timer = setInterval(() => {
            const currentHr = new Date().getHours()
            setPosition(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666))
        } , 60000)
        return () => clearInterval(timer);
    } , [])

    return (
        <div style={{ top : position}} className="timeline" />
    )
}


export default Timeline;