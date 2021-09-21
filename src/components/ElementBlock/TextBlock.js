import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { selfClearTimeout } from "../../utils";
import BlockController from "./BlockController";

const TextBlock = ({ value , isInEditMode , editContentHandler , removeContentHandler }) => {
    const [isInRemovingProcess, setIsInRemovingProcess] = useState(false);
    
    
    const internalRemoveHandler = () => {
        setIsInRemovingProcess(true);
        selfClearTimeout(() => {
            setIsInRemovingProcess(false);
            removeContentHandler();
        } , 700);
    }

    return (
        <div className={`textBlock ${isInRemovingProcess ? "textBlock--remove" : ""}`}>
            <div className="textBlock__container">
                <TextareaAutosize
                    readOnly={!isInEditMode}
                    onChange={({ target : { value } }) => editContentHandler(value)}
                    style={{ fontSize : "1.2rem" }} 
                    value={value} />
            </div>
            {/* <div className={`textBlock__removeTrigger ${isInEditMode ? "textBlock__removeTrigger--show" : ""}`}>
                <p onClick={internalRemoveHandler}>Remove</p>
            </div> */}
            <BlockController visible={isInEditMode} removeHandler={internalRemoveHandler} />
        </div>
    )
}

export default TextBlock;