import DescriptionPlayground from "../ToolBoxPlayground/DescriptionPlayground";
import BlockWrapper from "./BlockWrapper";

const DescBlock = ({ value , isInEditMode , editContentHandler , removeContentHandler }) => {
    return (
        <BlockWrapper controllerVisible={isInEditMode} removeHandler={removeContentHandler}>
            <DescriptionPlayground
                isInEditMode={isInEditMode} 
                onChange={editContentHandler} 
                value={value}
                inBlock />
        </BlockWrapper>
    )
}


export default DescBlock;