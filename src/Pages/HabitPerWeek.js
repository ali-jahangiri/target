import { useState } from "react";
import Container from "../components/Container";
import { idGenerator } from "../utils";
import { DragDropContext , Droppable , Draggable } from "react-beautiful-dnd";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { useEffect } from "react";
import { references } from "../firebase";
import Loading from "../components/Loading";
import client from "../client";


const namesOfDaysOfWeek = client.STATIC.DAY_OF_WEEK.map(el => ({ name : el , id : idGenerator() }))

const HabitPerWeek = ({ match , history }) => {
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState(null)
    const [currentTarget , setCurrentTarget] = useState([]);
    const [currentHabitBlock, setCurrentHabitBlock] = useState(null);


    const currentTargetId = match.params.id
    const comeFromTargetList = history.location.state?.comeFromTargetList;

    useEffect(() => {
        references.target.doc(currentTargetId)
            .get()
            .then(response => {
                setCurrentTarget(response.data());
                return response
            }).then(shit => {
                references.habitPerWeek.doc(currentTargetId)
                .get()
                .then(data => {
                    if(data.exists) {
                        setSchedule(data.data().schedule)
                        setLoading(false)
                    }else {
                        const base = {};
                        namesOfDaysOfWeek.map(el => base[el.name] = [])
                        setSchedule({...base})
                        const { color , targetName } = shit.data();
                            references.habitPerWeek.doc(currentTargetId).set({ targetName , color  , schedule : base })
                                .then(_ => setLoading(false))
                    }
                })

            })
    } , [currentTargetId])  

    


    const dragEndHandler = ({ destination, ...other }) => {
        setCurrentHabitBlock(null);
        if (!destination) return;
        
        if (namesOfDaysOfWeek.map((el) => el.name).includes(destination.droppableId) && other.source.droppableId !== "habitItems") {
          return habitOrderHandler(destination, other, schedule);
        }else if (destination && destination.droppableId !== "habitItems") {
          const selectedHabit = currentTarget.habit.find(el => el.id === other.draggableId).name;
          const targetDayColumn = destination.droppableId;
          // NOTE if selected habit exist in currentDay , leave   
          if(schedule[targetDayColumn].find(el => el.name === selectedHabit)) return;
          else {
            setSchedule(prev => ({
              ...prev,
              [targetDayColumn]: [
                ...prev[targetDayColumn],
                {
                  id: idGenerator(),
                  name: selectedHabit,
                },
              ],
            }));
          }
        }
      };
    
      const habitOrderHandler = (destination, other) => {
        setSchedule(prev => {
          const newOrderScheduleArray = Array.from(prev[destination.droppableId]);
          const newItem = newOrderScheduleArray.splice(other.source.index, 1);
          newOrderScheduleArray.splice(destination.index, 0, ...newItem);
          return {
            ...prev,
            [destination.droppableId]: newOrderScheduleArray,
          };
        });
      };
    

      const removeHabitHandler = (habitInsideDayName , habitId) => {
        setSchedule(prev => ({
            ...prev ,
            [habitInsideDayName] : prev[habitInsideDayName].filter(el => el.id !== habitId)
        }))
      } 


      const redirectToHome = () => {
          if(comeFromTargetList) history.goBack()
          else history.push('/');
      }

      const redirectForCreateHabit = () => history.push("/target")

      const dragStartHandler = (e) => {
        if (e.source.droppableId === "habitItems") {
          setCurrentHabitBlock(e.draggableId);
        }
      };


      useEffect(() => {
        if(!loading) {
            references.habitPerWeek.doc(currentTargetId).update({ targetName : currentTarget.targetName , color : currentTarget.color , schedule })
        }
      } , [schedule])



      
      return (
          <Loading loading={loading}>
            {isReady => {
                if(isReady) {
                    const haveAnyHabit = !!currentTarget?.habit?.length;
                        return (
                            <div className="habitPerDay">
                    <Container>
                    <div className={`habitPerDay__header ${!isSidebarOpen ? "habitPerDay__header--minified" : ""}`}>
                    <div>
                        <p className="habitPerDay__header__desc">Schedule for achieve</p>
                        <p>{currentTarget.targetName}</p>
                    </div>
                    <div>
                        <p onClick={() => haveAnyHabit ? redirectToHome() : redirectForCreateHabit()} className="habitPerDay__done">
                            {comeFromTargetList ? "Go back to Targets" :  (haveAnyHabit ? "Done With it" : "Let's add new Habit")}
                        </p>
                    </div>
                    </div>
                    <DragDropContext onDragStart={dragStartHandler} onDragEnd={dragEndHandler} >
                        <div className={`habitPerDay__schedulePlayground ${!haveAnyHabit ? "habitPerDay__schedulePlayground--disabled" : ""}`}>   
                        <div className="habitPerDay__weekDay">
                        {namesOfDaysOfWeek.map((nameOfDay, i) => (
                            <Droppable key={i} droppableId={nameOfDay.name}>
                            {provided => (
                                <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                key={i}
                                className={`habitPerDay__weekDay__item ${currentHabitBlock ? "habitPerDay__weekDay__item--hoverWithHabitInGrab" : ""}`} >
                                <div className="habitPerDay__weekDay__item__innerContainer">
                                    <p>{nameOfDay.name}</p>
                                </div>
                                <div id="FUCK">
                                    {(() => {
                                    return schedule[nameOfDay.name]?.map((el, i) => (
                                        <Draggable
                                            key={el.id}
                                            draggableId={el.id}
                                            index={i} >
                                        {(provided) => (
                                            <div
                                            ref={provided.innerRef}
                                            key={i}
                                            className="habitPerDay__weekDay__addedHabit"
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                            >
                                            <div style={{ backgroundColor : `#${currentTarget.color}` }}>
                                                <p>{el.name}</p>
                                                <span onClick={() => removeHabitHandler(nameOfDay.name , el.id)}>Remove</span>
                                            </div>
                                            </div>
                                        )}
                                        </Draggable>
                                    ));
                                    })()}
                                    {provided.placeholder}
                                </div>
                                </div>
                            )}
                            </Droppable>
                        ))}
                        </div>
                        {
                            haveAnyHabit && (
                                <div className={`habitPerDay__habitSidebar ${!isSidebarOpen ? "habitPerDay__habitSidebar--active" : ""}`} >
                                    <div
                                        onClick={() => setIsSidebarOpen(prev => !prev)}
                                        className="habitPerDay__habitSidebar__trigger" >
                                        {!isSidebarOpen ? <FiChevronLeft/> : <FiChevronRight />}
                                    </div>
                                    <div className="ss">
                                        <Droppable isDropDisabled droppableId="habitItems">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {
                                                currentTarget.habit.map((el , i) => (
                                                    <Draggable
                                                    draggableId={el.id}
                                                    key={i}
                                                    index={i} >
                                                        {provided => (
                                                            <div
                                                                className='sideBarHabit' 
                                                                ref={provided.innerRef}
                                                                {...provided.dragHandleProps}
                                                                {...provided.draggableProps} >
                                                                <div style={{ backgroundColor : `#${currentTarget.color}`}}>
                                                                    <span>{i + 1 < 10 ? `0${i + 1}` : i}</span>
                                                                    <p>{el.name}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                            {provided.placeholder}
                                            </div>
                                        )}
                                        </Droppable>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    </DragDropContext>
                    </Container>
                </div>)}
            }}
        </Loading>   
    )
}

export default HabitPerWeek;
