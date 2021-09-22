import { useLayoutEffect, useRef, useState } from "react";
import { colors } from "../utils";
import ToolBox from "./ToolBox";
import { FiArrowLeft } from "react-icons/fi";

import { selfClearTimeout } from "../utils";
import useKeyBaseState from "../Hook/useKeyBaseState";

const NewNoteThing = ({ addThingToNoteTreeHandler , hideBaseOnEditMode }) => {
    const [isToolsActive, setIsToolsActive] = useState(false);
    const [currentToolBox, setCurrentToolBox] = useState(null);
    const [isInCloseProcess, setIsInCloseProcess] = useState(false);
    const [isValidToTriggerDone, setIsValidToTriggerDone] = useState(false);
    const [shouldDoneTriggerGetHide, setShouldDoneTriggerGetHide] = useState(false);
    const [isInCreateProcess, setIsInCreateProcess] = useState(false);

    const [innerStore, setInnerStore] = useKeyBaseState({});

    const newNoteThingContainerRef = useRef();
    const toolBoxContainerRef = useRef();


    const closeEntireEditor = () => {
        setIsInCloseProcess(true);
        selfClearTimeout(() => {
            setIsToolsActive(false)
            setIsInCloseProcess(false);
        } , 800);
    }

    const triggerHandler = () => {
        if(!hideBaseOnEditMode) {
            if(isToolsActive && currentToolBox) {
                setCurrentToolBox(null);
                if(isInCloseProcess) setIsInCloseProcess(false);
                setInnerStore({});
            }else {
                if(isToolsActive) {
                    // NOTE this is callback for when user want to close entire editor (newThing creator);
                    closeEntireEditor();
                }else {
                    selfClearTimeout(() => toolBoxContainerRef.current.scrollIntoView({ behavior : "smooth" }) , 0);
                    setIsToolsActive(true);
                }
            };
        }
    }


    useLayoutEffect(() => {
        if(hideBaseOnEditMode) closeEntireEditor()
    } , [hideBaseOnEditMode])

    useLayoutEffect(() => {
        if(!isValidToTriggerDone) {
            selfClearTimeout(() => {
                setShouldDoneTriggerGetHide(true);
            } , 500);
        }else setShouldDoneTriggerGetHide(false)
    } , [isValidToTriggerDone]);


    const resetStatesHandler = () => {
        setIsInCreateProcess(false);
        setCurrentToolBox("");
        setInnerStore({});
        setIsValidToTriggerDone(false);
    }

    const doneWithEditorHandler = () => {
        setIsInCreateProcess(true);
        selfClearTimeout(() => {
            addThingToNoteTreeHandler(currentToolBox , innerStore[currentToolBox]);
            resetStatesHandler();
            selfClearTimeout(() => {
                newNoteThingContainerRef.current?.scrollIntoView({ behavior : "smooth" })
            } , 500);
        } , 1500);
    }

    const createOnFormSubmission = e => {
        if(e) e?.preventDefault()
        if(isValidToTriggerDone) {
            doneWithEditorHandler()
        }
    }

    return (
        <div ref={newNoteThingContainerRef} className="newNoteThing">
            <div className={`newNoteThing__trigger ${isInCreateProcess ? "newNoteThing__trigger--close" : ""}`}>
                <div className={`newNoteThing__trigger__controller ${hideBaseOnEditMode ? "newNoteThing__trigger__controller--disable" : ""}`} onClick={triggerHandler}>
                    {currentToolBox ? <div><FiArrowLeft /> <p>Back</p></div> : <p>{isToolsActive ? "Never mind!" : "Add new Thing"}</p>}
                </div>
                {
                    !shouldDoneTriggerGetHide && <div className={`newNoteThing__trigger__done ${!isValidToTriggerDone ? "newNoteThing__trigger__done--getHide" : ""}`}>
                        <p onClick={doneWithEditorHandler}>Done</p>
                    </div>
                }
            </div>
            <div ref={toolBoxContainerRef} className={`newNoteThing__toolDirectory ${isInCloseProcess ? "newNoteThing__toolDirectory--hide" : ""}`}>
                {
                        isToolsActive && ["image" , "text" , "description" , "link" , "voice"].map((el , i) => (
                        <ToolBox
                            createOnFormSubmission={createOnFormSubmission}
                            setIsValidToTriggerDone={setIsValidToTriggerDone}
                            isValidToTriggerDone={isValidToTriggerDone}
                            core={innerStore}
                            setCore={setInnerStore}
                            isInCreateProcess={isInCreateProcess}
                            isInCloseProcess={isInCloseProcess}
                            setCurrentToolBox={setCurrentToolBox} 
                            currentToolBox={currentToolBox} 
                            index={i} 
                            bgColor={colors[i]} 
                            name={el} 
                            key={i} />
                    ))
                }
            </div>
        </div>
    )
}


export default NewNoteThing;