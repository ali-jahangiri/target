import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Draggable } from "react-beautiful-dnd";


const command = ['emotion' , 'note' , 'reminder' , 'transaction'];

const Todo = ({ index , value , changeHandler }) => {
    const inputRef = useRef();
    const [hashtagInterpolate , setHashtagInterpolate] = useState(false);
    const [completedHash, setCompletedHash] = useState(false);

    const [contentHolder, setContentHolder] = useState("")

    const focusHandler = () => inputRef.current.focus()


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
        if(value && value?.slice(1)){
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
                        setCompletedHash(true)
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
        }
    } , [completedHash])

    return (
    <Draggable draggableId="injectedTodo" index={index}>
        {provided => (
            <div 
                className="todoInjector" 
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps} >
                {/* <p onClick={focusHandler}>have something todo out of schedule ?</p> */}
                <div  className="todoInjector__container">
                    <form onSubmit={interpolateSubmitHandler}>
                        {
                            hashtagInterpolate && <p style={{ color : !haveInterpolateValue && "grey" }} className="todoInjector__helperPlayground"><span style={{ color : "white" }}>#</span>{!!value.slice(1) ?  command.find(el => el.includes(value.slice(1)))?.split('').map((el , i) => <span key={i} style={{ color : i + 1 < value.length ? "white" : "grey" }}>{el}</span>) : 'Write here...'}</p>
                        }
                        <input className={`todoInjector__input ${hashtagInterpolate ? "todoInjector__input--interpolate" : ""}`} placeholder="Write something..." value={value} onChange={onChange} />
                        {
                            hashtagInterpolate && <span className="todoInjector__flash"></span>
                        }
                    </form>
                    {
                        !!completedHash && <input autoFocus value={contentHolder} onChange={({ target : { value } }) => setContentHolder(value)} />
                    }
                </div>
            </div>
            )
        }
    </Draggable>
    )
}


export default Todo;