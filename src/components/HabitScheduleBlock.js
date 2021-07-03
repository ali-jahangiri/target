import { Draggable } from "react-beautiful-dnd";

const HabitScheduleBlock = ({ draggableId , index , picked }) => (
    <Draggable 
                draggableId={draggableId} 
                index={index * index} >
                {provided => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className={`habitScheduleBlock ${picked === draggableId ? "habitScheduleBlock--selected" : ""}`}>
                        <p>{draggableId}</p>
                    </div>
                )}
    </Draggable>
)


export default HabitScheduleBlock;