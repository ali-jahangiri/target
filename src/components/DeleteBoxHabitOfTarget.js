import { useEffect, useRef, useState } from "react";

const DeleteBoxHabitOfTarget = ({ deleteHandler , renderSimple , changeResponsibleTextInto }) => {
    const [currentBoxSize, setCurrentBoxSize] = useState(0);
    const timerReference = useRef();

    const startDeleteHandler = () => {
        let timer = setInterval(() => {
            timerReference.current = timer;
            setCurrentBoxSize(prev => prev + 1)
        } , 5);
    }


    useEffect(() => {
        if(currentBoxSize >= (renderSimple ? 300 : 180)) {
            clearInterval(timerReference.current);
            deleteHandler();
            setCurrentBoxSize(0);
        }
    } , [currentBoxSize])

    const cancelDeleteProcessHandler = () => {
        clearInterval(timerReference.current);
        setCurrentBoxSize(0)
    }

    return changeResponsibleTextInto || (
        <div
            onMouseDown={startDeleteHandler} 
            onMouseUp={cancelDeleteProcessHandler}
            className={`targetBox__habitItem__deleteHabitController ${renderSimple ? "targetBox__habitItem__deleteHabitController--simple" : ""}`}>
                <p>
                    {
                        changeResponsibleTextInto || (renderSimple ? "Delete" : "Deleting")
                    }
                </p>
                <div style={{ width : `${currentBoxSize}%` , opacity : renderSimple ? currentBoxSize / 100 : 1 }}></div>
        </div>
    )
}



export default DeleteBoxHabitOfTarget;