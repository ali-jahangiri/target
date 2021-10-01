import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Resizable } from "re-resizable";
import PlaygroundInput from "./PlaygroundInput";
import { selfClearTimeout } from "../../utils";

import { MdVerticalAlignBottom , MdVerticalAlignTop } from "react-icons/md"

const ImagePlayground = ({
        isInEditMode,
        autoFocus = true,
        onChange , 
        setIsValidToTriggerDone ,
        inBlock = false,
        isValidToTriggerDone ,
        defaultInputValue = "" ,
        defaultSize = { height : 0 , width : 900 },
        defaultAlignment = "",
        liftValuesForFirstTime = true
}) => {
    const [inputValue, setInputValue] = useState(defaultInputValue);
    const [imageSize, setImageSize] = useState(defaultSize)

    const [isVisible, setIsVisible] = useState(inBlock);
    const [alignment, setAlignment] = useState(defaultAlignment)
    const [isInResizeProcess, setIsInResizeProcess] = useState(false);
    const [wasInvalidImage, setWasInvalidImage] = useState(false);

    const [someThingWasTouchForFirstTime, setSomeThingWasTouchForFirstTime] = useState(liftValuesForFirstTime);
    
    const isInInitialRender = useRef(true);

    const setAlignmentHandler = align => {
        setAlignment(align);
        setSomeThingWasTouchForFirstTime(true);
    }

    const onResize = (e, dir, ref) => {
        const { width , height } = ref.getClientRects()[0];
        setImageSize({width , height});
        setIsInResizeProcess(false);
        setSomeThingWasTouchForFirstTime(true);
    };

    useLayoutEffect(() => {
        selfClearTimeout(() => setIsVisible(true) , 800);
    } , [])


    const inputValueChangeHandler = (value = "") => {
        setInputValue(value);
        setSomeThingWasTouchForFirstTime(true)
        if(value && (!value.startsWith("http") || !value.startsWith("https"))) {
            setWasInvalidImage(true)
        }else if(wasInvalidImage) {
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
        
        if(!inBlock) {
            if(!wasInvalidImage && inputValue) {
                if(!isValidToTriggerDone) setIsValidToTriggerDone(true);
            }
            else setIsValidToTriggerDone(false);
        }

        if(someThingWasTouchForFirstTime) {
            onChange({
                path : inputValue , 
                size : imageSize,
                alignment : alignment || "center"
            });
        }

    } , [inputValue , imageSize , alignment]);


    useEffect(function setForcedValueToInternalState() {
        if(inBlock) {
            setSomeThingWasTouchForFirstTime(false)
            if(!isInInitialRender.current) {
                setAlignment(defaultAlignment);
                setImageSize(defaultSize);
                setInputValue(defaultInputValue);
            }else {
                isInInitialRender.current = false
            }
        }
    } , [defaultAlignment , defaultInputValue , defaultSize]);

    const enableResizingChecker = () => {
        if(wasInvalidImage || !isInEditMode) return false
        // Undefined mean render all side resize controller
        else return undefined
    }

    return (
        <div className="imagePlayground">
            <Resizable
                ref={resizableRef}
                enable={enableResizingChecker()}
                onResizeStart={setIsInResizeProcess}
                defaultSize={imageSize}
                onResizeStop={onResize}
                className={`imagePlayground__image ${inBlock ? "imagePlayground__image--inBlock" : ""} ${alignment ? `imagePlayground__image--${alignment}` : ""} ${isVisible ? "imagePlayground__image--visible" : ""} ${wasInvalidImage ? "imagePlayground__image--invalidImagePath" : ""} ${isInResizeProcess ? "imagePlayground__image--resize" : ""}`}
                style={{ backgroundImage : `url(${inputValue})` }}
                maxWidth="100%"
                minWidth={240}
                maxHeight={700}>
                        {
                            inputValue && isVisible && !wasInvalidImage && isInEditMode && <>
                                <div onClick={() => setAlignmentHandler('left')} className={`imagePlayground__leftAlign ${alignment === "left" ? "imagePlayground__leftAlign--hide" : ""}`}>
                                    <MdVerticalAlignTop />
                                </div>
                                <div onClick={() => setAlignmentHandler("right")} className={`imagePlayground__rightAlign ${alignment ===  "right" ? "imagePlayground__rightAlign--hide" : ""}`}>
                                    <MdVerticalAlignBottom />
                                </div>
                                {
                                    alignment && <div onClick={() => setAlignmentHandler(null)} className="imagePlayground__centerAlign">
                                        <MdVerticalAlignTop />
                                    </div>
                                }
                            </>
                        }
                        {
                            (isVisible && isInEditMode) && <div style={{ overflow : "hidden" , width : "100%" }}>
                                <PlaygroundInput
                                    autoFocus={autoFocus}
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