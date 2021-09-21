import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Resizable } from "re-resizable";
import PlaygroundInput from "./PlaygroundInput";
import { debounce, selfClearTimeout } from "../../utils";

import { MdVerticalAlignBottom , MdVerticalAlignTop , } from "react-icons/md"

const ImagePlayground = ({ onChange , setIsValidToTriggerDone , isValidToTriggerDone , defaultInputValue = "" , defaultSize = { height : 250 , width : 556 } , defaultAlignment = ""}) => {
    const [inputValue, setInputValue] = useState(defaultInputValue);
    const [imageSize, setImageSize] = useState(defaultSize)

    const [isVisible, setIsVisible] = useState(false);
    const [alignment, setAlignment] = useState(defaultAlignment)
    const [isInResizeProcess, setIsInResizeProcess] = useState(false);
    const [wasInvalidImage, setWasInvalidImage] = useState(false);


    const onResize = debounce((e, dir, ref) => {
        const { width , height } = ref.getClientRects()[0];
        setImageSize({width , height});
        setIsInResizeProcess(false);
    } , 0);

    useLayoutEffect(() => {
        selfClearTimeout(() => setIsVisible(true) , 800);
    } , [])


    const inputValueChangeHandler = (value = "") => {
        setInputValue(value)
        if(value && (!value.startsWith("http") || !value.startsWith("https"))) {
            setWasInvalidImage(true)
        }else if(wasInvalidImage)  {
            setWasInvalidImage(false)
        }
    }
    

    const resizableRef = useRef();

    useEffect(() => {
        const { width , height } = resizableRef.current?.resizable?.getClientRects()?.[0]
        setImageSize({
            width ,
            height
        })
    } , [inputValue])


    useEffect(() => {
        if(!wasInvalidImage && inputValue) {
            if(!isValidToTriggerDone) setIsValidToTriggerDone(true);
        }
        else setIsValidToTriggerDone(false);


        onChange({
            path : inputValue , 
            size : imageSize,
            alignment : alignment || "center"
        })

    } , [inputValue , imageSize , alignment])

    return (
        <div className="imagePlayground">
            <Resizable
                ref={resizableRef}
                enable={wasInvalidImage || undefined}
                onResizeStart={setIsInResizeProcess}
                defaultSize={{ width : 900 , height : 0 }}
                onResizeStop={onResize}
                className={`imagePlayground__image ${alignment ? `imagePlayground__image--${alignment}` : ""} ${isVisible ? "imagePlayground__image--visible" : ""} ${wasInvalidImage ? "imagePlayground__image--invalidImagePath" : ""} ${isInResizeProcess ? "imagePlayground__image--resize" : ""}`}
                style={{ backgroundImage : `url(${inputValue})` }}
                maxWidth="100%"
                minWidth={240}
                maxHeight={700}>
                        {
                            inputValue && isVisible && !wasInvalidImage && <>
                                <div onClick={() => setAlignment('left')} className={`imagePlayground__leftAlign ${alignment === "left" ? "imagePlayground__leftAlign--hide" : ""}`}>
                                    <MdVerticalAlignTop />
                                </div>
                                <div onClick={() => setAlignment("right")} className={`imagePlayground__rightAlign ${alignment ===  "right" ? "imagePlayground__rightAlign--hide" : ""}`}>
                                    <MdVerticalAlignBottom />
                                </div>
                                {
                                    alignment && <div onClick={() => setAlignment(null)} className="imagePlayground__centerAlign">
                                        <MdVerticalAlignTop />
                                    </div>
                                }
                            </>
                        }
                        {
                            isVisible && <div style={{ overflow : "hidden" , width : "100%" }}>
                                <PlaygroundInput
                                    className={`imagePlayground__input ${isVisible ? "imagePlayground__input--fade" : ""} ${!inputValue ? "imagePlayground__input--withoutImagePath" : ""} ${isInResizeProcess ? "imagePlayground__input--inResize" : ""}`}
                                    placeholder="Past image path "
                                    value={inputValue} 
                                    onChange={inputValueChangeHandler} />
                            </div>
                        }
            </Resizable>
        </div>
    )
}


export default ImagePlayground;