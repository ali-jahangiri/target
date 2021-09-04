import { useEffect, useRef, useState } from "react";

const DeleteBoxHabitOfTarget = ({ deleteHandler }) => {
    const [currentBoxSize, setCurrentBoxSize] = useState(0);
    const timerReference = useRef();

    const startDeleteHandler = () => {
        let timer = setInterval(() => {
            timerReference.current = timer;
            setCurrentBoxSize(prev => prev + 1)
        } , 5);
    }


    useEffect(() => {
        if(currentBoxSize >= 180) {
            clearInterval(timerReference.current);
            deleteHandler();
        }
    } , [currentBoxSize])

    const cancelDeleteProcessHandler = () => {
        clearInterval(timerReference.current);
        setCurrentBoxSize(0)
    }

    return (
        <div
            onMouseDown={startDeleteHandler} 
            onMouseUp={cancelDeleteProcessHandler}
            className="targetBox__habitItem__deleteHabitController">
                <div style={{ width : `${currentBoxSize}%` , height : `${currentBoxSize}%` }}></div>
        </div>
    )
}



export default DeleteBoxHabitOfTarget;