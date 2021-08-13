import { useEffect } from "react";
import { useState } from "react";

const Timeline = () => {
    const [forceToReRender, setForceToReRender] = useState(((new Date().getHours() - 1) * 100 ) + (new Date().getMinutes() * 1.66666));

    useEffect(() => {
        let timer = setInterval(() => {
            setForceToReRender(((new Date().getHours() - 1) * 100 ) + (new Date().getMinutes() * 1.66666))
        } , 60000)
        return () => clearInterval(timer);
    } , [])

    return (
        <div style={{ top : forceToReRender}} className="timeline">

        </div>
    )
}


export default Timeline;