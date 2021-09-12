import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

const TextPlayground = ({ core , setCore }) => {
    const [value, setValue] = useState("");

    return (
        <div className="textPlayground">
            <TextareaAutosize 
                value={value}
                minRows={2}
                placeholder="Write your Text here and rocking with it"
                onChange={({ target : { value } }) => setValue(value)}
            />
        </div>
    )
}



export default TextPlayground;