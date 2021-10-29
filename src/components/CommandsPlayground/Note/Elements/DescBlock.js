import DescriptionPlayground from "../ToolBoxPlayground/DescriptionPlayground";
import BlockWrapper from "./BlockWrapper";

const DescBlock = ({ value , isInEditMode , editContentHandler , removeContentHandler }) => {
    return (
        <BlockWrapper blockType="desc" controllerVisible={isInEditMode} removeHandler={removeContentHandler}>
            <DescriptionPlayground
                autoFocus={false}
                isInEditMode={isInEditMode} 
                onChange={editContentHandler} 
                value={value}
                inBlock />
        </BlockWrapper>
    )
}


export default DescBlock;