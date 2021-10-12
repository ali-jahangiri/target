import React, { useEffect, useState , useRef, useLayoutEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { generateColor, selfClearTimeout } from "../../utils";
import useAfterInitialEffect from "../AllWeekSchedule/useAfterInitialEffect";
import TextareaAutosize from "react-textarea-autosize";
import RoutineStreamSpendTime from "./RoutineStreamSpendTime";


const RoutineStreamDesc = ({ isOtherVisionVisible , descValue , descValueChangeHandler , setIsDescFocused }) => {
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef();

    const blurHandler = () => {
        setIsFocused(false);
        setIsDescFocused(false);
    }

    const focusHandler = () => {
        setIsFocused(true);
        setIsDescFocused(true);
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
    const [internalSpendTime, setInternalSpendTime] = useState(spendTime);
    const [isInResizing, setIsInResizing] = useState(false);
    const [descValue, setDescValue] = useState("");
    
    const [showSpend, setShowSpend] = useState(false);

    const [isFocusedInDescInput, setIsFocusedInDescInput] = useState(false);

    const textareaRef = useRef();

    const routineTime = hour.to - hour.from;

    


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

    

    useLayoutEffect(function initialFocusIntoTextarea() {
        if(isOtherVisionVisible) {
            textareaRef.current?.focus();
        }
    } , [textareaRef , isOtherVisionVisible])


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
                    className={`routineStream ${isFocusedInDescInput ? "routineStream--focusedInDesc" : ""}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    <div style={{ backgroundColor : generateColor(`#${color}` , 8) , height : routineTime * 100 }}>
                        <RoutineStreamSpendTime
                            routineTime={routineTime}
                            isOtherVisionVisible={isOtherVisionVisible}
                            setInternalSpendTime={setInternalSpendTime}
                            internalSpendTime={internalSpendTime}
                            setIsInResizing={setIsInResizing}
                            color={color}
                            showSpend={showSpend}
                            showSpendTimeResizable={showSpendTimeResizable}
                            spendTime={spendTime}
                        />
                        <div className="routineStream__name">
                            <p>{name}</p>
                        </div>
                        <div className="routineStream__spendTimeTrigger">
                            <p onClick={setShowSpend}>Set Spend Time</p>
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