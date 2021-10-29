import ImagePlayground from "../ToolBoxPlayground/ImagePlayground";
import BlockWrapper from "./BlockWrapper";

const ImageBlock = ({ value : { size , path , alignment }  , isInEditMode , editContentHandler , removeContentHandler}) => {

    return (
        <BlockWrapper blockType="image" controllerVisible={isInEditMode} removeHandler={removeContentHandler}>
                <ImagePlayground
                    autoFocus={false}
                    liftValuesForFirstTime={false} 
                    isInEditMode={isInEditMode} 
                    onChange={editContentHandler}
                    inBlock 
                    defaultAlignment={alignment}
                    defaultInputValue={path} 
                    defaultSize={size}  />
        </BlockWrapper>
    )
}



export default ImageBlock;