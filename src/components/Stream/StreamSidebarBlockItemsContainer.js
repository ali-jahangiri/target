import React from "react";
import { Draggable } from "react-beautiful-dnd";
import Portal from "../../Providers/Portal/Portal";
import StreamSidebarBlockItem from "./StreamSidebarBlockItem";
const DynamicWrapper = ({ isOneThatIsDragging , children }) => isOneThatIsDragging ? <Portal>{children}</Portal> :<React.Fragment>{children}</React.Fragment>


const StreamSidebarBlockItemsContainer = ({ todayHabit , leanedHabitInStream }) => (
    !!todayHabit.length && <div className="streamSidebar__blockItemsContainer">
        {todayHabit.map(el => (
            el.item.map((habit , index) => (
            <Draggable key={index} draggableId={habit.id} index={index}>
                {(provided , snapshot) => <DynamicWrapper isOneThatIsDragging={snapshot.isDragging}>
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`sliderHabitBlock__habitItem`}> 
                            <StreamSidebarBlockItem
                            color={el.color}
                            isInDragging={snapshot.isDragging}
                            name={habit.name}
                            alreadyUse={leanedHabitInStream.find(el => el.name === habit.name)} />
                    </div>
                </DynamicWrapper>}
            </Draggable>
            ))
        ))}
    </div>
)

export default StreamSidebarBlockItemsContainer;