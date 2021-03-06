import React from "react";
import Portal from "../../Providers/Portal/Portal";
import StreamSidebarBlockItem from "./StreamSidebarBlockItem";
const DynamicWrapper = ({ isOneThatIsDragging , children }) => isOneThatIsDragging ? <Portal>{children}</Portal> :<React.Fragment>{children}</React.Fragment>


const StreamSidebarBlockItemsContainer = ({ todayHabit , leanedHabitInStream  , setIsInDragging}) => (
    !!todayHabit.length && <div className="streamSidebar__blockItemsContainer">
        {todayHabit.map(el => (
            el.item.map((habit , index) => (
                <DynamicWrapper key={index} isOneThatIsDragging={false}>
                    <div className={`sliderHabitBlock__habitItem`}> 
                            <StreamSidebarBlockItem
                                setIsInDragging={setIsInDragging}
                                color={el.color}
                                isInDragging={false}
                                name={habit.name}
                                alreadyUse={leanedHabitInStream.find(el => el.name === habit.name)} />
                    </div>
                </DynamicWrapper>
            ))
        ))}
    </div>
)

export default StreamSidebarBlockItemsContainer;