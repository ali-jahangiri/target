import TextareaAutosize from "react-textarea-autosize";
import BlockWrapper from "./BlockWrapper";

const TextBlock = ({ value , isInEditMode , editContentHandler , removeContentHandler }) => {
    return (
        <BlockWrapper
            blockType="text"
            controllerVisible={isInEditMode} 
            removeHandler={removeContentHandler} >
            <TextareaAutosize
                    readOnly={!isInEditMode}
                    onChange={({ target : { value } }) => editContentHandler(value)}
                    style={{ fontSize : "1.2rem" }} 
                    value={value} />
        </BlockWrapper>
    )
}

export default TextBlock;