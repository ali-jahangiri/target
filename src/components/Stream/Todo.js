import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import TextareaAutosize from "react-textarea-autosize";

import useKeyBaseState from "../../Hook/useKeyBaseState";
import NewNoteThing from "../NewNoteThing";
import TodoInput from "./TodoInput";

const command = ['emotion' , 'note' , 'reminder' , 'transaction'];


const NotePlayground = ({ setContent , content }) => {
    return (
        <div className="notePlayground">
            <TextareaAutosize
                placeholder="Write your today feeling"
                value={content.feelingText} 
                minRows={2}
                onChange={({ target : { value } }) => setContent('feelingText' , value)}
            />
            <NewNoteThing 
                setContent={setContent} 
                content={content} />
        </div>
    )
}

const dynamicPlayground = rest => ({
    note : <NotePlayground {...rest} />,
    // note :  ,
    // reminder : ,
    // transaction
})


const Todo = ({ index , value , changeHandler , setToFullScreen }) => {
    const inputRef = useRef();
    const [hashtagInterpolate , setHashtagInterpolate] = useState(false);
    const [completedHash, setCompletedHash] = useState(false);

    const [content, setContent] = useKeyBaseState()


    const onChange = ({ target : { value = "" } }) => {
        changeHandler(value);
        setCompletedHash(false)
        if(value.startsWith("#")) {
            setHashtagInterpolate(true)
            const timer = setTimeout(() => {
                // setHashtagInterpolate(false);
                clearTimeout(timer);
            } , 5000) 
        }
        else {
            setHashtagInterpolate(false)
        }
    }

    const haveInterpolateValue = !!value.slice(1) 
    

    const interpolateSubmitHandler = (e) => {
        e.preventDefault();
        if(value && value?.slice(1) && !completedHash){
            const haveHelperInterpolateCommand = command.find(el => el.includes(value.slice(1)));
            if(haveHelperInterpolateCommand) {
                const leftCharacter = haveHelperInterpolateCommand.split("").filter((_ , i) => i + 1 >= value.length)
                let currentIndex = 0;
                let newVale = value
                
                let timer = setInterval(() => {
                    newVale += leftCharacter[currentIndex]
                    changeHandler(newVale)
                    ++currentIndex;
                    if(!leftCharacter[currentIndex]) {
                        setCompletedHash(true);
                        clearInterval(timer)
                    }
                } , 30)
                
            }else {
                console.log('dont hace');
            }
        }
    }

    useEffect(() => {
        if(completedHash) {
            console.log('cc' , value);
            setToFullScreen(true)
        }
    } , [completedHash])


    return (
    <Draggable isDragDisabled draggableId="injectedTodo" index={index}>
        {provided => (
            <div 
                className="todoInjector" 
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps} >
                <div  className="todoInjector__container">
                    <form onSubmit={interpolateSubmitHandler}>
                        {
                            hashtagInterpolate && <p style={{ color : !haveInterpolateValue && "grey" }} className="todoInjector__helperPlayground"><span style={{ color : "white" }}>#</span>{!!value.slice(1) ?  command.find(el => el.includes(value.slice(1)))?.split('').map((el , i) => <span key={i} style={{ color : i + 1 < value.length ? "white" : "grey" }}>{el}</span>) : 'Write commend here...'}</p>
                        }
                        <TodoInput value={value} onChange={onChange} hashtagInterpolate={hashtagInterpolate} />
                        {
                            hashtagInterpolate && <span className="todoInjector__flash"></span>
                        }
                    </form>
                    {
                        !!completedHash && dynamicPlayground({
                            content,
                            setContent,
                        })[value.slice(1)]
                    }
                </div>
            </div>
            )
        }
    </Draggable>
    )
}


export default Todo;