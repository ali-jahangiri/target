import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

const StreamDetailsWritable = ({
    showUp ,
    mainBgColor
}) => {
    const [value, setValue] = useState("");
    const [currentTextareaTopPos, setCurrentTextareaTopPos] = useState(144);
    
    const textAreaScrollHandler = e => {
        if(value) {
            if(e.deltaY > 0) {
                if(currentTextareaTopPos > 0) {
                    setCurrentTextareaTopPos(prev => prev - 25);
                }
            }else {
                if(currentTextareaTopPos < 144) {
                    setCurrentTextareaTopPos(prev => prev + 10)
                }
            }
        }
    }

    
    return (
        <div onWheel={textAreaScrollHandler} style={{ marginTop : `${currentTextareaTopPos}px` }} className={`streamDetailsWritable ${showUp ? "streamDetailsWritable--show" : ""}`}>
            <div style={{
                position: "fixed",
                left: 0,
                top: 0,
                zIndex : 99,
                background : `linear-gradient(#${mainBgColor}, transparent)`,
                width: "100%",
                height: 144 - currentTextareaTopPos,
                transition: ".3s"
            }} />
            <TextareaAutosize
                style={{ height : `calc(100vh - ${0}px)` }}
                
                value={value}
                onChange={({ target : { value } }) => setValue(value)}
                placeholder="Start write something about this Habit" />
        </div>
    )
}



export default StreamDetailsWritable;