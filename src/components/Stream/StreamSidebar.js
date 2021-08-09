import { Draggable, Droppable } from "react-beautiful-dnd";
import { FiChevronLeft, FiLock } from "react-icons/fi";
import Todo from "./Todo";

const HABIT_LIST_ID = "fromHabitList";


const StreamSidebar = ({ isSidebarOpen , currentDetailsModeHabit  , sideBarHandler , todayHabit , injectedTodo , setInjectedTodo }) => {
    return (
        <div className={`today__habitSidebar today__habitSidebar--${isSidebarOpen ? "open" : "close"} ${currentDetailsModeHabit ? "today__habitSidebar--lock" : ""}`}>
            <div
            onClick={() => !currentDetailsModeHabit && sideBarHandler()}
            className={`today__habitSidebar__closeTrigger ${isSidebarOpen ? "today__habitSidebar__closeTrigger--flipped" : ""}`}>
            {currentDetailsModeHabit ? <FiLock color="rgb(82, 82, 82)" /> : <FiChevronLeft color="rgb(82, 82, 82)" />}
          </div>
          <div className="today__habitSidebar__habitDirectory">
            <Droppable isDropDisabled droppableId={HABIT_LIST_ID}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {todayHabit.map(el => (
                    Object.values(el.schedule).filter(el => el.length).flat().map((habit , index) => (
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
                  <Todo
                    value={injectedTodo} 
                    changeHandler={setInjectedTodo} 
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