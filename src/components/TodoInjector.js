import { useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { FiPlus } from "react-icons/fi";
import Input from "./Input";


const TodoInjector = ({ index , value , changeHandler }) => {
    

    const inputRef = useRef();


    const focusHandler = () => {
        inputRef.current.focus()
    }

    return (
    <Draggable isDragDisabled={!value} draggableId="injectedTodo" index={index}>
        {provided => (
            <div className="todoInjector" 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                <p onClick={focusHandler}>have something todo out of schedule ?</p>
                <div className="todoInjector__container">
                    <div className="todoInjector__input">
                        <Input reference={inputRef} mode="dark" placeholder="write it here..." value={value} onChange={changeHandler} />
                    </div>
                    <div className="todoInjector__addTrigger">
                        <FiPlus color="white" />
                    </div>
                </div>
            </div>
            )
        }
    </Draggable>
    )
}


export default TodoInjector;