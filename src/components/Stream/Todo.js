import { useState , useEffect } from "react";
import { idGenerator, selfClearTimeout } from "../../utils";
import TodoForm from "./TodoForm";
import Commands from "./Commands";

const Todo = ({
    isSidebarOpen,
    index,
    setToFullScreen,
    isInFullScreen,
    leanDate,
    setInputValue,
    inputValue,
    setIsInDragging
}) => {
    // NOTE complete hash state mean we have a completed and valid comment string in input and we trigger and open the bounded commend

    const [inputValueContainsHash , setInputValueContainsHash] = useState(false);
    const [haveCompletedHash, setHaveCompleteHash] = useState(false);
    const [innerPlaygroundController, setInnerPlaygroundController] = useState({ callback : () => {} , label : "", closeTriggerConvertedTextTo : "Close" , overwriteCloseTriggerCallback : () => {} });

    
    const clearStatesHandler = () => {
        setToFullScreen(false);
        setInputValue("");
        setInputValue("")
        setInputValueContainsHash("");
        setHaveCompleteHash(false);
    }

    const closeHandler = () => clearStatesHandler();
    
    const draggingStartHandler = e => {
        setIsInDragging(true);
        e.dataTransfer.setData("details", JSON.stringify({name : inputValue , color : "303233" , i : idGenerator() , type : "todo"}))
    }
    

    useEffect(function clearStatesFromSidebarClose() {
        if(!isSidebarOpen) selfClearTimeout(clearStatesHandler , 300);
    } , [isSidebarOpen]);

    return (
        <div
            draggable={inputValue && !inputValueContainsHash} 
            unselectable="on"
            onDragStart={draggingStartHandler}
            className={`todoInjector ${isInFullScreen ? "todoInjector--inFullMode" : ""}`}>
            <div className="todoInjector__container">
                <div className="todoInjector__row">
                    <TodoForm
                        haveCompletedHash={haveCompletedHash}
                        setHaveCompleteHash={setHaveCompleteHash}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        inputValueContainsHash={inputValueContainsHash}
                        setInputValueContainsHash={setInputValueContainsHash}
                        isInFullScreen={isInFullScreen}
                        setToFullScreen={setToFullScreen}
                        isSidebarOpen={isSidebarOpen}
                    />
                    <div className="todoInjector__controller">
                        {
                            innerPlaygroundController.label && haveCompletedHash && <div className="todoInjector__helperController">
                                <p onClick={innerPlaygroundController.callback}>{innerPlaygroundController.label}</p>
                            </div>
                        }
                        <div className={`todoInjector__closeTrigger ${haveCompletedHash ? "todoInjector__closeTrigger--active" : ""}`}>
                            <p onClick={() => {
                                if(innerPlaygroundController?.overwriteCloseTriggerCallback) {
                                    innerPlaygroundController?.overwriteCloseTriggerCallback()
                                }else closeHandler();
                            }}>{innerPlaygroundController.closeTriggerConvertedTextTo || "Close"}</p>
                        </div>
                    </div>
                </div>
                {
                    !!haveCompletedHash && <Commands date={leanDate} targetCommend={inputValue.slice(1)} setInnerPlaygroundController={setInnerPlaygroundController} />
                }
            </div>
        </div>
    )
}


export default Todo;