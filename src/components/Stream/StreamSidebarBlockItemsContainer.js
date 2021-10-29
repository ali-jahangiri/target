import { Draggable } from "react-beautiful-dnd";
import StreamSidebarBlockItem from "./StreamSidebarBlockItem";

const StreamSidebarBlockItemsContainer = ({ todayHabit , leanedHabitInStream }) => (
    !!todayHabit.length && <div className="streamSidebar__blockItemsContainer">
            {todayHabit.map(el => (
                el.item.map((habit , index) => (
                <Draggable key={index} draggableId={habit.id} index={index}>
                {(provided) => (
                    <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="sliderHabitBlock__habitItem"> 
                        <StreamSidebarBlockItem
                        color={el.color} 
                        name={habit.name} 
                        alreadyUse={leanedHabitInStream.find(el => el.name === habit.name)} />
                    </div>
                )}
                </Draggable>
                ))
            ))}
        </div>
)

export default StreamSidebarBlockItemsContainer;