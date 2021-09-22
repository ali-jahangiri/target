import { useState } from "react";
import { selfClearTimeout } from "../../utils";
import ImagePlayground from "../ToolBoxPlayground/ImagePlayground";
import BlockController from "./BlockController";

const ImageBlock = ({ value : { size , path , alignment }  , isInEditMode , editContentHandler , removeContentHandler}) => {
    const [isInRemovingProcess, setIsInRemovingProcess] = useState(false);

    const internalRemoveHandler = () => {
        setIsInRemovingProcess(true);
        selfClearTimeout(() => {
            setIsInRemovingProcess(false);
            removeContentHandler();
        } , 700);
    }


    return (
        <div className={`imageBlock ${isInRemovingProcess ? "imageBlock--remove" : ""}`}>
            <ImagePlayground 
                liftValuesForFirstTime={false} 
                isInEditMode={isInEditMode} 
                onChange={editContentHandler} 
                inBlock 
                defaultAlignment={alignment} 
                defaultInputValue={path} 
                defaultSize={size}  />
            <BlockController removeHandler={internalRemoveHandler} visible={isInEditMode} />
        </div>
    )
}



export default ImageBlock;