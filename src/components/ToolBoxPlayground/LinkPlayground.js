import { useEffect, useState } from "react";
import { FiLink } from "react-icons/fi";
import { BiCalendarAlt } from "react-icons/bi";

import PlaygroundInput from "./PlaygroundInput";

const modeIcon = {
    webLink : <FiLink color="#5F939A" />,
    date : <BiCalendarAlt color="#C84B31" />
}

const LinkPlayground = ({ 
    setIsValidToTriggerDone , 
    value = { type : "" , linkPath : "" } , 
    onChange , 
    createOnFormSubmission,
    inBlock,
    liftValuesForFirstTime = true
 }) => {
    const [detectedMode, setDetectedMode] = useState(null);
    const [someThingWasTouchForFirstTime, setSomeThingWasTouchForFirstTime] = useState(liftValuesForFirstTime);

    const { linkPath } = value;

    const webLinkChecker = () => {
        if(linkPath.startsWith("https://") || linkPath.startsWith("http://")) {
            setDetectedMode('webLink')
        } else setDetectedMode(null);
    }

    const dateChecker = () => {
        if(linkPath) {
            const splittedString = linkPath.split("/");
            if(splittedString.length === 3) {
                const [year , month , day] = splittedString;
                if(year.length === 4 && month.length === 2 && day.length === 2) {
                    if([+year, +month , +day].every(el => !Number.isNaN(el))) {
                        if(month <= 12 && day <= 31) setDetectedMode("date");
                    }
                }
            }
        }
    }

    useEffect(() => {
        webLinkChecker();
        dateChecker();
    } , [linkPath])


    useEffect(() => {
        if(!inBlock) {
            if(detectedMode) setIsValidToTriggerDone(true);
            else setIsValidToTriggerDone(false);
        }
        if(someThingWasTouchForFirstTime) {
            onChange({
                linkPath,
                type : detectedMode
            })
        }

    } , [detectedMode])


    const onInputChangeHandler = inputValue => {
        setSomeThingWasTouchForFirstTime(true);
        onChange({
            type : detectedMode,
            linkPath : inputValue
        })
    }

    return (
        <form style={{ marginBottom : inBlock ? 16 : 0 }} onSubmit={createOnFormSubmission}>
            <div className={`linkPlayground ${inBlock ? "linkPlayground--inBlock" : ""}`}>
                    <PlaygroundInput
                        inBlock={inBlock}
                        value={linkPath} 
                        onChange={onInputChangeHandler} 
                        placeholder="Enter your Link or reference to a day or a web link"
                        autoFocus
                        className={`linkPlayground__input ${detectedMode ? `linkPlayground__input--${detectedMode}` : ""}`}
                    />
                    <div className={`linkPlayground__prefix ${detectedMode ? `linkPlayground__prefix--inMode` : ""}`}>
                        { modeIcon[detectedMode] }
                    </div>
            </div>
        </form>
    )
}



export default LinkPlayground;