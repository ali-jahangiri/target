import { useEffect , useState} from "react";

const Timeline = ({ shouldGetHide }) => {
    const currentHr = new Date().getHours()
    const [position, setPosition] = useState(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666));

    useEffect(() => {
        let timer = setInterval(() => {
            const currentHr = new Date().getHours();
            setPosition(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666))
        } , 60000)
        return () => clearInterval(timer);
    } , [])

    return (
        <div style={{ top : position}} className={`timeline ${shouldGetHide ? "timeline--hide" : ""}`} />
    )
}


export default Timeline;