import { useState , useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import TodoInput from "./TodoInput";

import { selfClearTimeout } from "../../utils";
import ReminderPlayground from "../Reminder/ReminderPlayground";
import NotePlayground from "../NotePlayground";

const command = ['note' , 'reminder'];

const dynamicPlayground = rest => ({
    note : <NotePlayground {...rest} />,
    reminder : <ReminderPlayground {...rest} />,
})


const Todo = ({ index , setToFullScreen , isInFullScreen , leanDate , setInputValue , inputValue }) => {
    const [hashtagInterpolate , setHashtagInterpolate] = useState(false);
    const [completedHash, setCompletedHash] = useState(false);
    
    const [flashDestroy, setFlashDestroy] = useState(false);

    const [innerPlaygroundController, setInnerPlaygroundController] = useState({ callback : () => {} , label : "", closeTriggerConvertedTextTo : "Close" , overwriteCloseTriggerCallback : () => {} });
    
    const onChange = ({ target : { value = "" } }) => {
        setInputValue(value);
        setInputValue(value)
        setCompletedHash(false)
        if(value.startsWith("#")) {
            setHashtagInterpolate(true)
            selfClearTimeout(() => {
                setFlashDestroy(true);
            } , 800)
        }
        else {
            setHashtagInterpolate(false)
            setFlashDestroy(false)
        }

        if(!value && isInFullScreen) setToFullScreen(false)
    }

    const closeHandler = () => {
        setToFullScreen(false);
        setInputValue("");
        setInputValue("")
        setHashtagInterpolate("");
        setCompletedHash(false);
    }

    const haveInterpolateValue = !!inputValue.slice(1) 
    
    const interpolateSubmitHandler = (e) => {
        e.preventDefault();
        if(inputValue && inputValue?.slice(1) && !completedHash){
            const haveHelperInterpolateCommand = command.find(el => el.includes(inputValue.slice(1)));
            if(haveHelperInterpolateCommand && inputValue?.slice(1) !== haveHelperInterpolateCommand) {
                const leftCharacter = haveHelperInterpolateCommand.split("").filter((_ , i) => i + 1 >= inputValue.length)
                let currentIndex = 0;
                let newVale = inputValue
                
                let timer = setInterval(() => {
                    newVale += leftCharacter[currentIndex]
                    setInputValue(newVale)
                    ++currentIndex;
                    if(!leftCharacter[currentIndex]) {
                        setCompletedHash(true);
                        clearInterval(timer)
                    }
                } , 30)
                
            }else if(inputValue?.slice(1) === haveHelperInterpolateCommand) {
                setCompletedHash(true);
            }
        }
    }

    useEffect(() => {
        if(completedHash) {
            const currentInterpolatorName = inputValue.slice(1);
            if(currentInterpolatorName === "note") setToFullScreen(100)
            else setToFullScreen(50)
        }
    } , [completedHash]);


    return (
    <Draggable 
        isDragDisabled={!!hashtagInterpolate || !inputValue}
        draggableId="injectedTodo" 
        index={index}>
        {provided => (
            <div 
                className={`todoInjector ${isInFullScreen ? "todoInjector--inFullMode" : ""}`}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps} >
                <div  className="todoInjector__container">
                    <form onSubmit={interpolateSubmitHandler}>
                        <div>
                            {
                                hashtagInterpolate && <p style={{ color : !haveInterpolateValue && "grey" }} className="todoInjector__helperPlayground"><span style={{ color : "white" }}>#</span>{!!inputValue.slice(1) ? command.find(el => el.startsWith(inputValue.slice(1)) && el.includes(inputValue.slice(1)))?.split('').map((el , i) => <span key={i} style={{ color : i + 1 < inputValue.length ? "white" : "grey" }}>{el}</span>) : 'Write your commend ...'}</p>
                            }
                                <TodoInput value={inputValue} onChange={onChange} hashtagInterpolate={hashtagInterpolate} />
                            {
                                (!flashDestroy && hashtagInterpolate) && <span className="todoInjector__flash"></span>
                            }
                            <div className={`todoInjector__dragHandHelper ${inputValue && !completedHash ? "todoInjector__dragHandHelper--active" : ""}`}>
                                <div>
                                    <div />
                                    <div />
                                    <div />
                                </div>
                                <div>
                                    <div />
                                    <div />
                                    <div />
                                </div>
                            </div>
                            
                        </div>
                        <div className="todoInjector__controller">
                            {
                                innerPlaygroundController.label && completedHash && <div className="todoInjector__helperController">
                                    <p onClick={innerPlaygroundController.callback}>{innerPlaygroundController.label}</p>
                                </div>
                            }
                            <div className={`todoInjector__closeTrigger ${completedHash ? "todoInjector__closeTrigger--active" : ""}`}>
                                <p onClick={() => {
                                    if(innerPlaygroundController?.overwriteCloseTriggerCallback) {
                                        innerPlaygroundController?.overwriteCloseTriggerCallback()
                                    }else closeHandler()
                                }}>{innerPlaygroundController.closeTriggerConvertedTextTo || "Close"}</p>
                            </div>
                        </div>
                    </form>
                    {
                        !!completedHash && dynamicPlayground({ setInnerPlaygroundController , leanDate })[inputValue.slice(1)]
                    }
                </div>
            </div>
            )
        }
    </Draggable>
    )
}


export default Todo;