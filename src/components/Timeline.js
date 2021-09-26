import { useEffect , useState  } from "react";

const Timeline = () => {
    const [position, setPosition] = useState(((new Date().getHours() - 1) * 100 ) + (new Date().getMinutes() * 1.66666));

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