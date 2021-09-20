import { useLayoutEffect, useRef, useState } from "react";
import { colors } from "../utils";
import ToolBox from "./ToolBox";
import { FiArrowLeft } from "react-icons/fi";

import { selfClearTimeout } from "../utils";
import useKeyBaseState from "../Hook/useKeyBaseState";

const NewNoteThing = ({ addThingToNoteTreeHandler }) => {
    const [isToolsActive, setIsToolsActive] = useState(false);
    const [currentToolBox, setCurrentToolBox] = useState(null);
    const [isInCloseProcess, setIsInCloseProcess] = useState(false);
    const [isValidToTriggerDone, setIsValidToTriggerDone] = useState(false);
    const [shouldDoneTriggerGetHide, setShouldDoneTriggerGetHide] = useState(false);
    const [isInCreateProcess, setIsInCreateProcess] = useState(false);

    const [innerStore, setInnerStore] = useKeyBaseState({});

    const newNoteThingContainerRef = useRef();

    const triggerHandler = () => {
        if(isToolsActive && currentToolBox) {
            setCurrentToolBox(null);
            if(isInCloseProcess) setIsInCloseProcess(false);
            setInnerStore({});
        }else {
            if(isToolsActive) {
                setIsInCloseProcess(true);
                selfClearTimeout(() => {
                    setIsToolsActive(prev => !prev)
                    setIsInCloseProcess(false);
                } , 400);
            }else setIsToolsActive(prev => !prev);
        };
    }


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
        } , 1500)
    }


    console.log(innerStore , "inner");

    return (
        <div ref={newNoteThingContainerRef} className="newNoteThing">
            <div className={`newNoteThing__trigger ${isInCreateProcess ? "newNoteThing__trigger--close" : ""}`}>
                <div className="newNoteThing__trigger__controller" onClick={triggerHandler}>
                    {currentToolBox ? <div><FiArrowLeft /> <p>Back</p></div> : <p>{isToolsActive ? "Never mind!" : "Add new Thing"}</p>}
                </div>
                {
                    !shouldDoneTriggerGetHide && <div className={`newNoteThing__trigger__done ${!isValidToTriggerDone ? "newNoteThing__trigger__done--getHide" : ""}`}>
                        <p onClick={doneWithEditorHandler}>Done</p>
                    </div>
                }
            </div>
            <div className="newNoteThing__toolDirectory">
                {
                        isToolsActive && ["image" , "text" , "description" , "link" , "voice"].map((el , i) => (
                        <ToolBox
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