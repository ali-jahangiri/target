import { useEffect, useState } from "react";
import { FiLink } from "react-icons/fi";
import { BiCalendarAlt } from "react-icons/bi";

import PlaygroundInput from "./PlaygroundInput";

const modeIcon = {
    webLink : <FiLink color="#5F939A" />,
    date : <BiCalendarAlt color="#C84B31" />
}

const LinkPlayground = ({ setIsValidToTriggerDone , value = { type : "" , linkPath : "" } , onChange }) => {
    const [detectedMode, setDetectedMode] = useState(null);

    const { linkPath , type } = value


    const webLinkChecker = () => {
        if(linkPath.startsWith("https://") || linkPath.startsWith("http://")) {
            setDetectedMode('webLink')
        } else setDetectedMode(null)
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
        dateChecker()
    } , [linkPath])


    useEffect(() => {
        if(detectedMode) setIsValidToTriggerDone(true);
        else setIsValidToTriggerDone(false);

        onChange({
            linkPath,
            type : detectedMode
        })
    } , [detectedMode])


    const onInputChangeHandler = inputValue => {
        onChange({
            type : detectedMode,
            linkPath : inputValue
        })
    }

    return (
        <div className="linkPlayground">
            <PlaygroundInput 
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
    )
}



export default LinkPlayground;