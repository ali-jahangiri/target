import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { FiChevronLeft, FiLock } from "react-icons/fi";
import { generateColor } from "../../utils";

import Todo from "./Todo";

const HABIT_LIST_ID = "fromHabitList";


const StreamSidebar = ({ 
    isSidebarOpen , 
    currentDetailsModeHabit  , 
    sideBarHandler , 
    todayHabit , 
    setShouldOverlayGetVisible , 
    leanDate , 
    setInjectedTodo , 
    isDraggingStart , 
    leanedHabitInStream = []
}) => {
  const [isInFullScreen, setIsInFullScreen] = useState(false);
  const [todoInputValue, setTodoInputValue] = useState("");
  

  useEffect(() => {
    if(isDraggingStart) setInjectedTodo(todoInputValue);
  } , [todoInputValue , isDraggingStart])
  
  useLayoutEffect(() => {
    if(isInFullScreen) {
      setShouldOverlayGetVisible(true)
    }else setShouldOverlayGetVisible(false)
  } , [isInFullScreen])
  
  const internalSideBarCloseHandler = () => {
    sideBarHandler()
    setTodoInputValue("")
  }

  useEffect(function todoInputValueCleanupAfterCreation() {
    if(leanedHabitInStream.some(el => el.name === todoInputValue)) setTodoInputValue("")
  } , [isDraggingStart])

  const sidebarContainerRef = useRef();

  return (
        <div style={{ width : isInFullScreen ? `${isInFullScreen}vw` : "30vw" }} className={`today__habitSidebar ${isInFullScreen ? "today__habitSidebar--full" : ""} today__habitSidebar--${isSidebarOpen ? "open" : "close"} ${currentDetailsModeHabit ? "today__habitSidebar--lock" : ""}`}>
            <div
            onClick={() => !currentDetailsModeHabit && internalSideBarCloseHandler()}
            className={`today__habitSidebar__closeTrigger ${isSidebarOpen ? "today__habitSidebar__closeTrigger--flipped" : ""}`}>
            {currentDetailsModeHabit ? <FiLock color="rgb(82, 82, 82)" /> : <FiChevronLeft color="rgb(82, 82, 82)" />}
          </div>
          <div 
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
                              {
                                leanedHabitInStream.find(el => el.name === habit.name) && <div>
                                  <p>Already Used</p>
                                </div>
                              }
                            </div>
                          </div>
                        )}
                      </Draggable>
                      ))
                    ))}
                  </div>
                  <Todo
                    setInputValue={setTodoInputValue}
                    inputValue={todoInputValue}
                    leanDate={leanDate}
                    isInFullScreen={isInFullScreen}
                    setToFullScreen={setIsInFullScreen}
                    index={todayHabit.length} 
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
    )
}


export default StreamSidebar;