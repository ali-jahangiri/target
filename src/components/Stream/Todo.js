import { useState , useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import TextareaAutosize from "react-textarea-autosize";

import useKeyBaseState from "../../Hook/useKeyBaseState";
import NewNoteThing from "../NewNoteThing";
import TodoInput from "./TodoInput";

import { DescBlock, ImageBlock, LinkBlock, TextBlock } from "../ElementBlock"

const command = ['emotion' , 'note' , 'reminder' , 'transaction'];



const blocksClone = ({ key , ...rest }) => ({
    text : <TextBlock {...rest} key={key} />,
    image : <ImageBlock {...rest} key={key} />,
    description : <DescBlock {...rest} key={key} />,
    link : <LinkBlock {...rest} key={key} />
})

const NotePlayground = ({ setInnerPlaygroundController }) => {
    const [content , setContent] = useKeyBaseState({title : "" , thingList : []})
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [haveAnyChangeInEditMode, setHaveAnyChangeInEditMode] = useState(false);
    const [tempContent, setTempContent] = useState(null);


    const addThingToNoteTreeHandler = (thingType , thingValue) => {
        setContent(prev => ({
            ...prev,
            thingList : [
                ...prev?.thingList,
                {
                    name : thingType,
                    value : thingValue
                }
            ]
        }));
    }


    const resetEditMode = () => {
        setIsInEditMode(false);
        setHaveAnyChangeInEditMode(false);
        setTempContent(content);
    }


    const stageTempContentHandler = () => {
        setContent("thingList" , tempContent.thingList)
        setIsInEditMode(false);
        setHaveAnyChangeInEditMode(false);
    }

    const removeThingTreeHandler = index => {
        setTempContent(prev => ({
            ...prev,
            thingList : prev.thingList.filter((_ , i) => i !== index)
        }))
    };

    const editThingHandler = (index , value) => {
        setHaveAnyChangeInEditMode(true);
        setTempContent(prev => ({
            ...prev,
            wasEdited : true,
            thingList : prev.thingList.map((el , i) => {
                if(i === index) {
                    if(!value) {
                        // TODO show a alert to user that you delete thing in background
                        console.log('remove');
                        // return removeThingTreeHandler(index)
                    }
                    else return { name : el.name , value }
                }else return el
            })
        }))
    };

    const attachEditTriggerToControllerChecker = () => {
        if(content.thingList.length) {
            setInnerPlaygroundController({
                callback : () => {
                    if(!isInEditMode) setIsInEditMode(prev => !prev)
                    else stageTempContentHandler();
                },
                label : haveAnyChangeInEditMode ? "Save Change" : (isInEditMode ? "Back" : "Edit content"),
                overwriteCloseTriggerCallback : resetEditMode,
                closeTriggerConvertedTextTo : tempContent.wasEdited && isInEditMode ?  "Cancel" : "Close"
            })
        }else {
            setInnerPlaygroundController({callback : () => {}});
        }
    }

    useEffect(function syncTempContentHandler() {
        setTempContent(content)
    } , [content]);

    useEffect(() => {
        attachEditTriggerToControllerChecker();
    } , [content , isInEditMode , haveAnyChangeInEditMode, tempContent])


    const dynamicThingList = (() => isInEditMode ? tempContent.thingList : content.thingList)();


    console.log(dynamicThingList , "dynamicThingList" , isInEditMode );

    return (
        <div className="notePlayground">
            <TextareaAutosize
                placeholder="Give note a Title ..."
                value={content.noteTitle} 
                minRows={2}
                onChange={({ target : { value } }) => setContent("title" ,value)}
            />
            {
                dynamicThingList.map((el , i) => blocksClone({ key : i , isInEditMode , editContentHandler : value => editThingHandler(i , value) , removeContentHandler : () => removeThingTreeHandler(i) ,  ...el })[el.name])
            }
            <NewNoteThing 
                hideBaseOnEditMode={isInEditMode} 
                addThingToNoteTreeHandler={addThingToNoteTreeHandler} />
        </div>
    )
}

const dynamicPlayground = rest => ({
    note : <NotePlayground {...rest} />,
    // note :  ,
    // reminder : ,
    // transaction
})


const Todo = ({ index , setToFullScreen , isInFullScreen }) => {
    const [hashtagInterpolate , setHashtagInterpolate] = useState(false);
    const [completedHash, setCompletedHash] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const [innerPlaygroundController, setInnerPlaygroundController] = useState({ callback : () => {} , label : "", closeTriggerConvertedTextTo : "Close" , overwriteCloseTriggerCallback : () => {} });

    const onChange = ({ target : { value = "" } }) => {
        setInputValue(value);
        setCompletedHash(false)
        if(value.startsWith("#")) setHashtagInterpolate(true)
        else setHashtagInterpolate(false)

        if(!value && isInFullScreen) setToFullScreen(false)
    }

    const closeHandler = () => {
        if(innerPlaygroundController?.overwriteCloseTriggerCallback) {
            innerPlaygroundController?.overwriteCloseTriggerCallback()
        }else {
            setToFullScreen(false);
            setInputValue("");
            setHashtagInterpolate("");
            setCompletedHash(false);
        }
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
    } , [completedHash])


    return (
    <Draggable isDragDisabled draggableId="injectedTodo" index={index}>
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
                                hashtagInterpolate && <p style={{ color : !haveInterpolateValue && "grey" }} className="todoInjector__helperPlayground"><span style={{ color : "white" }}>#</span>{!!inputValue.slice(1) ?  command.find(el => el.includes(inputValue.slice(1)))?.split('').map((el , i) => <span key={i} style={{ color : i + 1 < inputValue.length ? "white" : "grey" }}>{el}</span>) : 'Write commend here...'}</p>
                            }
                                <TodoInput value={inputValue} onChange={onChange} hashtagInterpolate={hashtagInterpolate} />
                            {
                                hashtagInterpolate && <span className="todoInjector__flash"></span>
                            }
                        </div>
                        <div className="todoInjector__controller">
                            {
                                innerPlaygroundController.label && <div className="todoInjector__helperController">
                                    <p onClick={innerPlaygroundController.callback}>{innerPlaygroundController.label}</p>
                                </div>
                            }
                            <div className={`todoInjector__closeTrigger ${completedHash ? "todoInjector__closeTrigger--active" : ""}`}>
                                <p onClick={closeHandler}>{innerPlaygroundController.closeTriggerConvertedTextTo || "Close"}</p>
                            </div>
                        </div>
                    </form>
                    {
                        !!completedHash && dynamicPlayground({ setInnerPlaygroundController })[inputValue.slice(1)]
                    }
                </div>
            </div>
            )
        }
    </Draggable>
    )
}


export default Todo;