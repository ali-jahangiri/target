import { useEffect } from "react";
import PlaygroundTextArea from "./PlaygroundTextArea";

const DescriptionPlayground = ({ 
    value , 
    onChange , 
    setIsValidToTriggerDone , 
    inBlock , 
    isInEditMode = true 
}) => {

    useEffect(() => {
        if(!inBlock) {
            if(value) {
                setIsValidToTriggerDone(true);
            }else setIsValidToTriggerDone(false);
        }
    } , [value]);
    
    return (
        <div className={`descPlayground ${inBlock ? "descPlayground--inBlock" : ""}`}>
            <div className="descPlayground__container">
                <div className="descPlayground__avatarBox" />
                <PlaygroundTextArea
                    readOnly={!isInEditMode}
                    inBlock={inBlock}
                    value={value}
                    onChange={onChange}
                    placeholder="start write your short description from here" 
                />
            </div>
        </div>
    )
}


export default DescriptionPlayground;