import TextareaAutosize from "react-textarea-autosize";

const TextBlock = ({ value }) => {
    return (
        <div className="textBlock">
            <TextareaAutosize
                readOnly 
                style={{ fontSize : "1.2rem" }} 
                value={value} />
        </div>
    )
}

export default TextBlock;