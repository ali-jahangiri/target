import { Draggable } from "react-beautiful-dnd";

const EmptyHabitBlock = ({ index, id }) => (
    <Draggable draggableId={id} isDragDisabled index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="stream__invalidHabitBlock"
          ></div>
        )}
    </Draggable>
);


export default EmptyHabitBlock;