import { useEffect, useState } from "react";
import { FiLink } from "react-icons/fi";
import { BiCalendarAlt } from "react-icons/bi";


const modeIcon = {
    webLink : <FiLink color="#5F939A" />,
    date : <BiCalendarAlt color="#C84B31" />
}

const LinkPlayground = ({ core , setCore }) => {
    const [value, setValue] = useState("");
    const [detectedMode, setDetectedMode] = useState(null);


    const webLinkChecker = () => {
        if(value.startsWith("https://") || value.startsWith("http://")) {
            setDetectedMode('webLink')
        }else if(false) {

        }else setDetectedMode(null)
    }

    const dateChecker = () => {
        if(value) {
            const splittedString = value.split("/");
            if(splittedString.length === 3) {
                const [year , month , day] = splittedString;
                if(year.length === 4 && month.length === 2 && day.length === 2) {
                    setDetectedMode("date");
                }
            }
        }
    }

    useEffect(() => {
        webLinkChecker();
        dateChecker()
    } , [value])


    return (
        <div className="linkPlayground">
            <div className={`linkPlayground__prefix ${detectedMode ? `linkPlayground__prefix--${detectedMode}` : ""}`}>
                { modeIcon[detectedMode] }
            </div>
            <input
                className={`linkPlayground__input ${detectedMode ? `linkPlayground__input--${detectedMode}` : ""}`}
                value={value} 
                onChange={({ target : { value } }) => setValue(value)} 
                autoFocus 
                placeholder="Enter your Link or reference to a day or a web link " />
        </div>
    )
}



export default LinkPlayground;