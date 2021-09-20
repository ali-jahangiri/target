import { useEffect } from "react";
import PlaygroundTextArea from "./PlaygroundTextArea";

const DescriptionPlayground = ({ value , onChange , setIsValidToTriggerDone }) => {

    useEffect(() => {
        if(value) {
            setIsValidToTriggerDone(true);
        }else setIsValidToTriggerDone(false);
    } , [value])
    
    return (
        <div className="descPlayground">
            <div className="descPlayground__container">
                <div className="descPlayground__avatarBox" />
                <PlaygroundTextArea
                    value={value}
                    onChange={onChange}
                    placeholder="start write your short description from here" 
                />
            </div>
        </div>
    )
}


export default DescriptionPlayground;