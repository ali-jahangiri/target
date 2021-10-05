import { Draggable } from "react-beautiful-dnd";
import { generateColor } from "../../utils";

const RoutineStream = ({ id , color , name , hour , index }) => {
    console.log(hour);
    return (
        <Draggable draggableId={id} index={index} isDragDisabled>
            {provided => (
                <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}>
                    <div style={{ backgroundColor : generateColor(`#${color}` , 8) , height : (hour.to - hour.from) * 100 }} className="routineStream">
                        <div className="routineStream__name">
                            <p>{name}</p>
                        </div>
                        <div className="routineStream__circle">
                            <div style={{ backgroundColor : `#${color}` }} />
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}



export default RoutineStream;