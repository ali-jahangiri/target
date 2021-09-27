import { useLayoutEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { FiChevronLeft, FiLock } from "react-icons/fi";
import { debounce } from "../../utils";
import Todo from "./Todo";

const HABIT_LIST_ID = "fromHabitList";


const StreamSidebar = ({ isSidebarOpen , currentDetailsModeHabit  , sideBarHandler , todayHabit , setShouldOverlayGetVisible , leanDate }) => {
  const [isInFullScreen, setIsInFullScreen] = useState(false);
  const [containerScroll, setContainerScroll] = useState(0);

  useLayoutEffect(() => {
  if(isInFullScreen) {
      setShouldOverlayGetVisible(true)
    }else setShouldOverlayGetVisible(false)
  } , [isInFullScreen])

  // const onContainerScrollHandler = debounce(e => setContainerScroll(e.target.scrollTop) , 25);

  const sidebarContainerRef = useRef();

  return (
        <div style={{ width : isInFullScreen ? `${isInFullScreen}vw` : "30vw" }} className={`today__habitSidebar ${isInFullScreen ? "today__habitSidebar--full" : ""} today__habitSidebar--${isSidebarOpen ? "open" : "close"} ${currentDetailsModeHabit ? "today__habitSidebar--lock" : ""}`}>
            <div
            onClick={() => !currentDetailsModeHabit && sideBarHandler()}
            className={`today__habitSidebar__closeTrigger ${isSidebarOpen ? "today__habitSidebar__closeTrigger--flipped" : ""}`}>
            {currentDetailsModeHabit ? <FiLock color="rgb(82, 82, 82)" /> : <FiChevronLeft color="rgb(82, 82, 82)" />}
          </div>
          <div 
            // onScroll={onContainerScrollHandler}
            ref={sidebarContainerRef}
            className="today__habitSidebar__habitDirectory">
            <Droppable isDropDisabled droppableId={HABIT_LIST_ID}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <div className="today__habitSidebar__habitBlocksContainer">
                    {!!todayHabit.length && todayHabit.map(el => (
                      el.item.map((habit , index) => (
                        <Draggable key={index} draggableId={habit.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="sliderHabitBlock__habitItem"> 
                            <div style={{backgroundColor: `#${el.color || "dcdcdc"}`}}
                              className="sliderHabitBlock__habitItem__container">
                              <p>{habit.name}</p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                      ))
                    ))}
                  </div> 
                  <Todo
                    parentRef={sidebarContainerRef.current}
                    leanDate={leanDate}
                    containerScroll={containerScroll}
                    isInFullScreen={isInFullScreen}
                    setToFullScreen={setIsInFullScreen}
                    index={todayHabit.length} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
    )
}


export default StreamSidebar;