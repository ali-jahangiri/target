import TextareaAutosize from "react-textarea-autosize";

const TextBlock = ({ value , isInEditMode , editContentHandler , removeContentHandler }) => {
    return (
        <div className="textBlock">
            <div className="textBlock__container">
                <TextareaAutosize
                    readOnly={!isInEditMode}
                    onChange={({ target : { value } }) => editContentHandler(value)}
                    style={{ fontSize : "1.2rem" }} 
                    value={value} />
            </div>
            <div className={`textBlock__removeTrigger ${isInEditMode ? "textBlock__removeTrigger--show" : ""}`}>
                <p onClick={removeContentHandler}>Remove</p>
            </div>
        </div>
    )
}

export default TextBlock;