import { useEffect , useState} from "react";
import { addZeroToAboveTenNumber } from "../utils";

const Timeline = ({ shouldGetHide }) => {
    const currentHr = new Date().getHours();
    const currentMin = new Date().getMinutes();

    const [position, setPosition] = useState(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666));

    useEffect(() => {
        let timer = setInterval(() => {
            const currentHr = new Date().getHours();
            setPosition(((currentHr > 0 ? currentHr - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666))
        } , 60000);
        return () => clearInterval(timer);
    } , [])

    return (
        <div style={{ top : position}} className={`timeline ${shouldGetHide ? "timeline--hide" : ""}`} >
            <span>
                <p>{`${addZeroToAboveTenNumber(currentHr)}:${addZeroToAboveTenNumber(currentMin)}`}</p>
            </span>
        </div>
    )
}


export default Timeline;