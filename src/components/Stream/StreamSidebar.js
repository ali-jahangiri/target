import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { FiChevronLeft, FiLock } from "react-icons/fi";
import client from "../../client";
import { selfClearTimeout } from "../../utils";
import StreamSidebarBlockItemsContainer from "./StreamSidebarBlockItemsContainer";

import Todo from "./Todo";


const StreamSidebar = ({ 
  isSidebarOpen, 
  isInStreamDetailsMode, 
  sideBarHandler, 
  todayHabit, 
  date, 
  setInjectedTodo, 
  isInDragging, 
  leanedHabitInStream = [],
}) => {
  const [isInFullScreen, setIsInFullScreen] = useState(false);
  const [todoInputValue, setTodoInputValue] = useState("");
  
  useEffect(() => {
    if(isInDragging) setInjectedTodo(todoInputValue);
  } , [todoInputValue , isInDragging]);
  
  
  const internalSideBarCloseHandler = () => {
    sideBarHandler();
    selfClearTimeout(() => {
      setTodoInputValue("");
    } , 300);
  }

  useEffect(function todoInputValueCleanupAfterCreation() {
    if(leanedHabitInStream.some(el => el.name === todoInputValue)) setTodoInputValue("");
  } , [isInDragging, leanedHabitInStream, todoInputValue]);


  return (
        <div 
          style={{ width : isInFullScreen ? `${isInFullScreen}vw` : "30vw" , zIndex : 999 }} 
          className={`streamSidebar ${isInFullScreen ? "streamSidebar--full" : ""} streamSidebar--${isSidebarOpen ? typeof isSidebarOpen === 'string' ? "fade" : "open" : "close"} ${isInStreamDetailsMode ? "streamSidebar--lock" : ""}`}>
            <div
            onClick={() => !isInStreamDetailsMode && internalSideBarCloseHandler()}
            className={`streamSidebar__closeTrigger ${isSidebarOpen ? "streamSidebar__closeTrigger--flipped" : ""}`}>
            {isInStreamDetailsMode ? <FiLock color="rgb(82, 82, 82)" /> : <FiChevronLeft color="rgb(82, 82, 82)" />}
          </div>
          <div 
            className="streamSidebar__habitDirectory">
            <Droppable isDropDisabled droppableId={client.STATIC.HABIT_LIST_ID}>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <StreamSidebarBlockItemsContainer 
                    leanedHabitInStream={leanedHabitInStream} 
                    todayHabit={todayHabit}
                  />
                  <Todo
                    isSidebarOpen={isSidebarOpen}
                    setInputValue={setTodoInputValue}
                    inputValue={todoInputValue}
                    leanDate={date}
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