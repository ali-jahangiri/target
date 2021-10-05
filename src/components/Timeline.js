import { useEffect , useLayoutEffect, useState  } from "react";
import { selfClearTimeout } from "../utils";

const Timeline = ({ shouldGoToCurrentHour }) => {
    const [position, setPosition] = useState(((new Date().getHours() - 1) * 100 ) + (new Date().getMinutes() * 1.66666));

    useLayoutEffect(function scrollIntoCurrentHour() {
        if(shouldGoToCurrentHour) {
            selfClearTimeout(() => {
                document.querySelector('.mainContainer').scrollTo({ top : position , behavior : "smooth" })
            } , 500)
        }
    } , []);

    useEffect(() => {
        let timer = setInterval(() => {
            setPosition(((new Date().getHours() - 1) * 100 ) + (new Date().getMinutes() * 1.66666))
        } , 60000)
        return () => clearInterval(timer);
    } , [])

    return (
        <div style={{ top : position}} className="timeline" />
    )
}


export default Timeline;