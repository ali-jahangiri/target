import { useCallback, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { debounce } from "../../utils";
import DeleteStreamItem from "./DeleteStreamItem";

const StreamDetailsWritable = ({
    showUp ,
    mainBgColor,
    syncValueHandler,
    value,
    deleteHandler,
}) => {
    const [innerValue, setInnerValue] = useState(value || "");
    const [currentTextareaTopPos, setCurrentTextareaTopPos] = useState(144);
    const textareaRef = useRef();


    const textAreaScrollHandler = e => {
        if(value) {
            if(e.deltaY > 0) {
                if(currentTextareaTopPos > 0 && textareaRef.current.clientHeight >= (window.innerHeight - 150)) {
                    setCurrentTextareaTopPos(prev => prev - 25);
                }
            }else {
                if(currentTextareaTopPos < 144) {
                    setCurrentTextareaTopPos(prev => prev + 10)
                }
            }
        }
    }

    const inputValueChange = value => {
        if(!value) setCurrentTextareaTopPos(144);
        setInnerValue(value);
        debouncedValueCallback(value);
    }


    const debouncedValueCallback = useCallback(debounce(passedValue => {
        syncValueHandler(passedValue)
    } , 500) , [])

    
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
                ref={textareaRef}
                style={{ height : `calc(100vh - ${0}px)` }}
                value={innerValue}
                onChange={({ target : { value } }) => inputValueChange(value)}
                placeholder="Start write something about this Habit" />
            <DeleteStreamItem clickHandler={deleteHandler} />
        </div>
    )
}



export default StreamDetailsWritable;