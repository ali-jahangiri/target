import { Draggable } from "react-beautiful-dnd";
import { generateColor } from "../../utils";

const RoutineStream = ({ id , color , name , hour , index }) => {
    return (
        <Draggable draggableId={id} index={index} isDragDisabled>
            {provided => (
                <div
                className="routineStream"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}>
                    <div onClick={() => console.log('s')} style={{ backgroundColor : generateColor(`#${color}` , 8) , height : (hour.to - hour.from) * 100 }}>
                        <div className="routineStream__name">
                            <p>{name}</p>
                        </div>
                        <div className="routineStream__circle">
                            <div style={{ backgroundColor : `#${color}` }} />
                        </div>
                        <div className="routineStream__time">
                            <p>From <span>{hour.from + 1}</span> To <span>{hour.to + 1}</span></p>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}



export default RoutineStream;