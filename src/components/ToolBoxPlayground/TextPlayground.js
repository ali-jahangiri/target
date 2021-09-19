import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { selfClearTimeout } from "../../utils";

const TextPlayground = ({ core , setCore }) => {
    const [value, setValue] = useState("");
    const [textareaH, setTextareaH] = useState(70);

    useEffect(() => {
        selfClearTimeout(() => {
            setTextareaH('auto');
        } , 2500);
    } , [])

    return (
        <div className="textPlayground">
            <TextareaAutosize 
                value={value}
                minRows={2}
                height={20}
                style={{ height : textareaH }}
                placeholder="Write your Text here"
                onChange={({ target : { value } }) => setValue(value)}
            />
        </div>
    )
}



export default TextPlayground;