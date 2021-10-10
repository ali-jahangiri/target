import React, { useEffect, useState , useRef, useLayoutEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Resizable } from "re-resizable";
import { debounce, generateColor, selfClearTimeout } from "../../utils";
import StreamResizeTrigger from "./StreamResizeTrigger";
import useAfterInitialEffect from "../AllWeekSchedule/useAfterInitialEffect";
import TextareaAutosize from "react-textarea-autosize";


const RoutineStreamDesc = ({ isOtherVisionVisible , descValue , descValueChangeHandler , setIsDescFocused }) => {
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef();

    const blurHandler = () => {
        setIsFocused(false);
    }

    const focusHandler = () => {
        setIsFocused(true);
    }

    useLayoutEffect(()  => {
        selfClearTimeout(() => {
            if(isOtherVisionVisible) {
                textareaRef.current?.focus();
            }
        } , 500);
    } , []);

    return (
        <div className={`routineStream__desc ${isFocused ? "routineStream__desc--focused" : ""} ${!isOtherVisionVisible ? "routineStream__desc--hide" : ""}`}>
            <TextareaAutosize
                onFocus={focusHandler}
                onBlur={blurHandler}
                placeholder="What about this Routine ?"
                value={descValue}
                onChange={descValueChangeHandler}
                ref={textareaRef}
            />
        </div>
    )
}


const optionsList = ["Completed" , "Half of it" , "Leave"];
const optionsHeight = {
    Completed : 100 , 
    "Half of it" : 50 ,
    Leave : 25
}

const RoutineStream = ({ 
    id , 
    color , 
    name , 
    hour ,
    index , 
    habitInStream ,
    spendTime = 50,
    setIsInOtherVisionToParent,
    setPropHandler,
 }) => {

    const [liftedTimeFromAboveBlocks, setLiftedTimeFromAboveBlocks] = useState(null);
    const [isOtherVisionVisible, setIsOtherVisionVisible] = useState(false);
    const [showSpendTimeResizable, setShowSpendTimeResizable] = useState(false);
    const [currentActiveSuggest, setCurrentActiveSuggest] = useState(null);
    const [showSuggestContainer, setShowSuggestContainer] = useState(true);
    const [internalSpendTime, setInternalSpendTime] = useState(spendTime);
    const [isInResizing, setIsInResizing] = useState(false);
    const [hasTouchOnManualResize, setHasTouchOnManualResize] = useState(false);
    const [removeSuggestHour, setRemoveSuggestHour] = useState(false);
    const [descValue, setDescValue] = useState("");

    const [showSpend, setShowSpend] = useState(false);

    const [isFocusedInDescInput, setIsFocusedInDescInput] = useState(false);

    const textareaRef = useRef();

    const routineTime = hour.to - hour.from;

    const userDontSetSpentTimeYet = internalSpendTime === -1;
    const getFullSpendTime = internalSpendTime === 100;
    const almostLeaveSpendTime = internalSpendTime < 10;


    useEffect(function calcOverPushFromAboveBlock() {
        const validStream = habitInStream.filter(el => el.name);
        const targetStreamForSelectIndex = validStream.findIndex(el => el.id === id);
        const pureArrayBeforeCurrentSelectedStream = [...validStream].splice(0 , targetStreamForSelectIndex)
        const pushCountFromAboveBlocks = pureArrayBeforeCurrentSelectedStream.reduce((acc , res) => acc + res.hoursGoNext , 0) - pureArrayBeforeCurrentSelectedStream.length;
        setLiftedTimeFromAboveBlocks(pushCountFromAboveBlocks);
    }, [habitInStream, id, index, name]);

    const toggleOtherVisionHandler = () => {
        setIsOtherVisionVisible(prev => !prev);
        if(isOtherVisionVisible === false) {
            setShowSpendTimeResizable(true);
            let fromHour = hour.from;
            const toHour = hour.to;
            const currentElementTopPosition = fromHour * 100;
            document.getElementsByClassName('mainContainer')[0].scroll({ top : currentElementTopPosition , behavior : "smooth" });
            const possibleStep = new Array(toHour - fromHour).fill("").map(() => ++fromHour);
            setIsInOtherVisionToParent(id , possibleStep , currentElementTopPosition)
        }else {
            setIsInOtherVisionToParent()
            selfClearTimeout(() => {
                setShowSpendTimeResizable(false)
            } , 350);
        }
    }

    const selectSuggestHourHandler = hour => {
        if(hour !== currentActiveSuggest) {
            setCurrentActiveSuggest(hour);
            selfClearTimeout(() => {
                setInternalSpendTime(optionsHeight[hour]);
            } , 1000);
            
            selfClearTimeout(() => {
                setShowSuggestContainer(false);
            } , 500)
        }
    }

    useLayoutEffect(function initialFocusIntoTextarea() {
        if(isOtherVisionVisible) {
            textareaRef.current?.focus();
        }
    } , [textareaRef , isOtherVisionVisible])

    const onResizeStartHandler = () => {
        setHasTouchOnManualResize(true);
        setIsInResizing(true);
        selfClearTimeout(() => {
            setRemoveSuggestHour(true);
        } , 350)
    }

    const onResizeEndHandler = () => {
        setIsInResizing(false);
    }
    
    
    const onResizeHandler = debounce((e , dir , resRef) => {
        const roundedReceivedNumber = Math.ceil(Math.round(resRef.clientHeight / 50) * 50);
        const percentOfFilled = Math.ceil((roundedReceivedNumber / routineTime));
        setInternalSpendTime(percentOfFilled);
    } , 15);


    const descValueChangeHandler = ({ target : { value } }) => setDescValue(value);

    const spendTimeHandler = () => setShowSpend(prev => !prev);

    useAfterInitialEffect(function syncRoutineWithParentHandler (){
        if(!isInResizing) {
            setPropHandler({ id , propName : "spendTime" , value : internalSpendTime })
        }
    } , [internalSpendTime , isInResizing]);

    return (
        <Draggable draggableId={id} index={index} isDragDisabled>
            {provided => (
                <div
                    className="routineStream"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    <div style={{ backgroundColor : generateColor(`#${color}` , 8) , height : routineTime * 100 }}>
                        <Resizable
                                minWidth="100%"
                                minHeight={showSpend ? 50 : 0}
                                size={{ height : isOtherVisionVisible ? (userDontSetSpentTimeYet ? "50%" : `${internalSpendTime}%`) : 0 }}
                                maxHeight="100%"
                                defaultSize={{ height : "75%" }}
                                enable={{ bottom : true }}
                                handleComponent={{ bottom : <StreamResizeTrigger /> }}
                                grid={[50 , 50]}
                                onResizeStart={onResizeStartHandler}
                                onResizeStop={onResizeEndHandler}
                                onResize={onResizeHandler}
                                style={{ backgroundColor : `#${color}`}}
                                className={`routineStream__doneUnitResizable ${!showSpend ? "routineStream__doneUnitResizable--hide" : ""} ${showSpendTimeResizable ? "routineStream__doneUnitResizable--showUp" : ""}`}>
                                {
                                    spendTime === -1 && !removeSuggestHour && spendTime  && <div className={`routineStream__donePreviewText ${hasTouchOnManualResize ? "routineStream__donePreviewText--getHide" : ""}`}>
                                        <div className="routineStream__donePreviewText__container">
                                            <div style={{ display : "flex" }}>
                                                <p>How much you spend for this <span>Routine</span>?</p>
                                                {
                                                    currentActiveSuggest && <div
                                                        key={currentActiveSuggest}
                                                        className={`routineStream__currentSelectedSuggest ${currentActiveSuggest ? "routineStream__currentSelectedSuggest--haveValue" : ""}`}
                                                        onClick={() => setShowSuggestContainer(prev => !prev)} >
                                                        {currentActiveSuggest}
                                                </div>
                                                }
                                            </div>
                                            <div className={`routineStream__suggestHourContainer ${!showSuggestContainer ? "routineStream__suggestHourContainer--getHide" : ""}`}>
                                                {
                                                    showSpendTimeResizable && optionsList.map((el , i) => (
                                                        <div
                                                            style={{ animationDelay : `${(i + 1) * 650}ms`}} 
                                                            onClick={() => selectSuggestHourHandler(el)} key={i} 
                                                            className={`routineStream__suggestItem ${currentActiveSuggest === el ? "routineStream__suggestItem--active" : ""}`}>
                                                            <p>{el}</p>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className={`routineStream__spendHourPercent ${hasTouchOnManualResize || !userDontSetSpentTimeYet ? "routineStream__spendHourPercent--show" : ""}`}>
                                    <p style={{ opacity : (getFullSpendTime || almostLeaveSpendTime) ? 0 : 1 }}>{userDontSetSpentTimeYet ? "50%" : `${internalSpendTime}%`}</p>
                                    <p className={`routineStream__spendHourPercent__helperText ${(getFullSpendTime || almostLeaveSpendTime) ? "routineStream__spendHourPercent__helperText--active" : ""}`}>
                                        {
                                            getFullSpendTime ? "Done !" : "Leave"
                                        }
                                    </p>
                                </div>
                            </Resizable>
                        <div className="routineStream__name">
                            <p>{name}</p>
                        </div>
                        <RoutineStreamDesc
                            spendTimeHandler={spendTimeHandler}
                            isOtherVisionVisible={isOtherVisionVisible}
                            textareaRef={textareaRef}
                            descValue={descValue}
                            descValueChangeHandler={descValueChangeHandler}
                            setIsDescFocused={setIsFocusedInDescInput}
                        />
                        <div style={{ background : generateColor(`#${color}` , 9) }} className={`routineStream__helperFiller ${isOtherVisionVisible ? "routineStream__helperFiller--active" : ""}`}></div>
                        <div className={`routineStream__footer ${isOtherVisionVisible ? "routineStream__footer--otherVision" : ""}`}>
                            <div onClick={toggleOtherVisionHandler} className="routineStream__circle">
                                <div style={{ backgroundColor : `#${color}` }} />
                            </div>
                            <div className="routineStream__time">
                                <p>From <span>{hour.from + 1}</span> To <span>{hour.to + 1}</span></p>
                            </div>
                            {
                                !!liftedTimeFromAboveBlocks && <div className="routineStream__timeLiftAlert">
                                    <p>Delayed for <span>{liftedTimeFromAboveBlocks} hour{liftedTimeFromAboveBlocks > 1 && "s"}</span></p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}



export default RoutineStream;