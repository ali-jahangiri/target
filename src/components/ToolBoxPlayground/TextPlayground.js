import { useEffect } from "react";
import PlaygroundTextArea from "./PlaygroundTextArea"

const TextPlayground = ({ value , onChange , setIsValidToTriggerDone }) => {

    useEffect(() => {
        if(value) setIsValidToTriggerDone(true)
        else setIsValidToTriggerDone(false)
    } , [value]);

    return (
        <div className="textPlayground">
            <PlaygroundTextArea
                value={value} 
                onChange={onChange} 
                placeholder="Start Write your Text from here"
            />
        </div>
    )
}



export default TextPlayground;