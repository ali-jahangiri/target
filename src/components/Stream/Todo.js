import { useState , useEffect} from "react";
import { Draggable } from "react-beautiful-dnd";
import TextareaAutosize from "react-textarea-autosize";

import useKeyBaseState from "../../Hook/useKeyBaseState";
import NewNoteThing from "../NewNoteThing";
import TodoInput from "./TodoInput";

import { ImageBlock, TextBlock } from "../ElementBlock"

const command = ['emotion' , 'note' , 'reminder' , 'transaction'];



const blocksClone = ({ key , ...rest }) => ({
    text : <TextBlock {...rest} key={key} />,
    image : <ImageBlock {...rest} key={key} />
})

const NotePlayground = () => {
    const [content , setContent] = useKeyBaseState({title : "" , thingList : []})

    const addThingToNoteTreeHandler = (thingType , thingValue) =>{
        setContent(prev => ({
            ...prev,
            thingList : [
                ...prev?.thingList,
                {
                    name : thingType,
                    value : thingValue
                }
            ]
        }))
    }


    console.log(content , "CONTENT");

    return (
        <div className="notePlayground">
            <TextareaAutosize
                placeholder="Give note a Title ..."
                value={content.noteTitle} 
                minRows={2}
                onChange={({ target : { value } }) => setContent("title",value)}
            />
            {
                content.thingList.map((el , i) => blocksClone({ key : i , ...el })[el.name])
            }
            <NewNoteThing addThingToNoteTreeHandler={addThingToNoteTreeHandler} />
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

    const [content, setContent] = useKeyBaseState({});
    

    const onChange = ({ target : { value = "" } }) => {
        setInputValue(value);
        setCompletedHash(false)
        if(value.startsWith("#")) setHashtagInterpolate(true)
        else setHashtagInterpolate(false)

        if(!value && isInFullScreen) setToFullScreen(false)
    }

    const closeHandler = () => {
        setToFullScreen(false);
        setInputValue("");
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

    const addThingToNoteTreeHandler = () => {

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
                        <div className={`todoInjector__closeTrigger ${completedHash ? "todoInjector__closeTrigger--active" : ""}`}>
                            <p onClick={closeHandler}>Close</p>
                        </div>
                    </form>
                    {
                        !!completedHash && dynamicPlayground({
                            addThingToNoteTreeHandler,
                        })[inputValue.slice(1)]
                    }
                </div>
            </div>
            )
        }
    </Draggable>
    )
}


export default Todo;