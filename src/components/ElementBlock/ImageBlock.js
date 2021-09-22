import ImagePlayground from "../ToolBoxPlayground/ImagePlayground";
import BlockWrapper from "./BlockWrapper";

const ImageBlock = ({ value : { size , path , alignment }  , isInEditMode , editContentHandler , removeContentHandler}) => {
    

    return (
        <BlockWrapper controllerVisible={isInEditMode} removeHandler={removeContentHandler}>
                <ImagePlayground
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