import React, { useRef, useState } from "react";
import useKeyBaseState from "../../Hook/useKeyBaseState";
import { colors, generateColor, hourValueChecker, requests, selfClearTimeout } from "../../utils";
import Input from "../Input";
import useAfterInitialEffect from "./useAfterInitialEffect";




const RoutineBlock = ({ name , color , hour , id , currentDayName , editRoutineHandler }) => {
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [draftRoutineValue , setDraftRoutineValue] = useKeyBaseState({ name , color , hour : { from : +hour.from , to : +hour.to } , id });
    const [shouldHideEditModeOverlay, setShouldHideEditModeOverlay] = useState(true);

    const [wantToCancelEditMode, setWantToCancelEditMode] = useState(false);

    const [isUserSureForDeletion, setIsUserSureForDeletion] = useState(false);

    const [isInRemoveProcess, setIsInRemoveProcess] = useState(false);

    const mainContainerRef = useRef();

    const leaveHandler = () => {
        setIsInEditMode(false)
        setDraftRoutineValue({ name , color , hour });
        setIsUserSureForDeletion(false)
    }

    const saveChangeHandler = () => {
        setIsInEditMode(false);
        selfClearTimeout(() => {
            setWantToCancelEditMode(false)
            editRoutineHandler(draftRoutineValue);
        } , 500)
    }


    const wantToCancelEditModeHandler = () => {
        if(haveSomeChange) {
            setWantToCancelEditMode(true);
            selfClearTimeout(() => {
                setWantToCancelEditMode(false);
            } , 500)
        }else {
            setIsInEditMode(false)
        }
    }


    const removeHandler = () => {
        if(!isUserSureForDeletion) {
            setIsUserSureForDeletion(true)
        }else {
            setIsInEditMode(false);
            setIsInRemoveProcess(true)
            selfClearTimeout(() => {
                requests.routine.removeRoutine(currentDayName , {id , name, hour , color})
                    .then(() => {
                        setIsUserSureForDeletion(false)
                        setIsInRemoveProcess(false)
                    })
            } , 1500);
        }
    }


    const timeHourChangeHandler = (destination , value) => {
        const { from , to } = draftRoutineValue.hour;

        setDraftRoutineValue('hour' , {
            ...draftRoutineValue.hour,
            [destination] : hourValueChecker(+value - 1 , destination , to + 1 , from)
        })
    }

    const activeEditModeHandler = () => {
        setIsInEditMode(true)
        mainContainerRef.current.scrollIntoView({ behavior : "smooth" })
    }

    const pickerRandomColorHandler = () => {
        setDraftRoutineValue("color" , colors[Math.floor(Math.random() * colors.length)])
    }

    const haveSomeChange = (() => {
        if(draftRoutineValue.name !== name) return true;
        else if(draftRoutineValue.color !== color) return true;
        else if(draftRoutineValue.hour.from !== hour.from || draftRoutineValue.hour.to !== hour.to ) return true;
    })();

    
    useAfterInitialEffect(function debounceDisplayOfOverlayHandler() {
        if(isInEditMode) setShouldHideEditModeOverlay(false);
        else {
            selfClearTimeout(() => setShouldHideEditModeOverlay(true) , 450)
        }
    } , [isInEditMode]);


    return (
        <React.Fragment>
            {
                !shouldHideEditModeOverlay && <div onClick={wantToCancelEditModeHandler} className={`weekDay__routineEditModeOverlay ${!isInEditMode ? "weekDay__routineEditModeOverlay--hide" : ""}`} />
            }
            <div ref={mainContainerRef} style={{ backgroundColor : generateColor(`#${draftRoutineValue.color}` , 8) }} className={`weekDay__routineItem ${isInRemoveProcess ? "weekDay__routineItem--getRemoved" : ""} ${isInEditMode ? "weekDay__routineItem--inEditMode" : ""}`}>
                <div className="weekDay__routineItem__name">
                    <Input
                        placeholder="Routine Name"
                        mode="dark" 
                        readOnly={!isInEditMode} 
                        value={draftRoutineValue.name} 
                        onChange={value => setDraftRoutineValue("name" , value)} />
                </div>
                <div className="weekDay__routineItem__hour">
                    <div>From <Input 
                        type="number"
                        min={1}
                        length={2}
                        max={24}
                        onBlur={() => {
                            if(!Number(draftRoutineValue.hour.from)) {
                                timeHourChangeHandler("from" , 1) 
                            }
                        }}
                        value={Number(draftRoutineValue.hour.from) + 1} 
                        onChange={value => timeHourChangeHandler('from' , value)} 
                        readOnly={!isInEditMode} /> To <Input
                            onChange={value => timeHourChangeHandler("to" , value)}
                            onBlur={() => {
                                if(!Number(draftRoutineValue.hour.to)) {
                                    timeHourChangeHandler("to" , draftRoutineValue.hour.from + 1)
                                }
                            }}
                            type="number"
                            min={1} 
                            max={24} 
                            value={Number(draftRoutineValue.hour.to) + 1} 
                            readOnly={!isInEditMode} /></div>
                    <span onClick={activeEditModeHandler} className={`weekDay__routineItem__circle ${isInEditMode ? "weekDay__routineItem__circle--active" : ""}`}>
                        <span style={{ backgroundColor : `#${draftRoutineValue.color}` }} />
                    </span>
                </div>
                <div className={`weekDay__routineItem__controller ${wantToCancelEditMode ? "weekDay__routineItem__controller--preventCloseByOverlayAction" : ""} ${isInEditMode ? "weekDay__routineItem__controller--show" : ""}`}>
                    <div>
                        <button style={{ color : isUserSureForDeletion ? "red" : "black" , transition : ".3s" }} onClick={removeHandler}>{isUserSureForDeletion ? "Are you sure ?" : "Remove"}</button>
                    </div>
                    <div className={`weekDay__routineItem__controller__save ${haveSomeChange ? "weekDay__routineItem__controller__save--active" : ""}`}>
                            <button onClick={saveChangeHandler}>Save</button>
                    </div>
                    <div className="weekDay__routineItem__controller__cancel">
                        <button onClick={leaveHandler}>{haveSomeChange ? "Cancel" : "Back"}</button>
                    </div>
                </div>
                <div className={`weekDay__routineItem__colorPicker ${isInEditMode ? "weekDay__routineItem__colorPicker--show" : ""}`}>
                    <p onClick={pickerRandomColorHandler}>Pick a color</p>
                </div>
            </div>
        </React.Fragment>
    )
}


export default RoutineBlock;