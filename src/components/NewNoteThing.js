import { useState } from "react";
import { colors } from "../utils";
import ToolBox from "./ToolBox";
import { FiArrowLeft } from "react-icons/fi";

import { selfClearTimeout } from "../utils";
import useKeyBaseState from "../Hook/useKeyBaseState";

const NewNoteThing = () => {
    const [isToolsActive, setIsToolsActive] = useState(false);
    const [currentToolBox, setCurrentToolBox] = useState(null);
    const [isInCloseProcess, setIsInCloseProcess] = useState(false);
    const [isValidToTriggerDone, setIsValidToTriggerDone] = useState(false);


    const [core, setCore] = useKeyBaseState({});

    const triggerHandler = () => {
        if(isToolsActive && currentToolBox) {
            setCurrentToolBox(null);
            if(isInCloseProcess) setIsInCloseProcess(false);
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


    const createNewThingHandler = () => {

    }

    return (
        <div className="newNoteThing">
            <div className="newNoteThing__trigger">
                <div className="newNoteThing__trigger__controller" onClick={triggerHandler}>
                    {currentToolBox ? <div><FiArrowLeft /> <p>Back</p></div> : <p>{isToolsActive ? "Never mind!" : "Add new Thing"}</p>}
                </div>
                <div className="newNoteThing__trigger__done">
                    <p onClick={createNewThingHandler}>Done</p>
                </div>
            </div>
            <div className="newNoteThing__toolDirectory">
                {
                        isToolsActive && ["image" , "text" , "description" , "link" , "voice"].map((el , i) => (
                        <ToolBox
                            core={core}
                            setCore={setCore}
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