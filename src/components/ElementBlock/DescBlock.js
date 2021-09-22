import DescriptionPlayground from "../ToolBoxPlayground/DescriptionPlayground";
import BlockController from "./BlockController";

const DescBlock = ({ value , isInEditMode , editContentHandler , removeContentHandler }) => {
    return (
        <div className="descBlock">
            <DescriptionPlayground 
                isInEditMode={isInEditMode} 
                onChange={editContentHandler} 
                value={value}
                inBlock />
            <BlockController removeHandler={removeContentHandler} visible={isInEditMode}  />
        </div>
    )
}


export default DescBlock;