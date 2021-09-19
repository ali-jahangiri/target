import { useEffect, useState } from "react";
import { selfClearTimeout } from "../../utils";

import PlaygroundTextArea from "./PlaygroundTextArea"

const TextPlayground = ({ core , setCore }) => {
    const [value, setValue] = useState("");


    return (
        <div className="textPlayground">
            <PlaygroundTextArea 
                value={value} 
                onChange={setValue} 
                placeholder="Start Write your Text from here"
                className="textPlayground__textarea"
            />
        </div>
    )
}



export default TextPlayground;