import { useState } from "react";
import Container from "../components/Container";
import { idGenerator } from "../utils";
import { DragDropContext , Droppable , Draggable } from "react-beautiful-dnd";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { useEffect } from "react";
import { references } from "../firebase";
import Loading from "../components/Loading";


const namesOfDaysOfWeek = [
    {
        name : "جمعه",
        id : idGenerator()
    },
    {
        name : "پنج‌شنبه",
        id : idGenerator()
    },
    {
        name : "چهار شنبه",
        id : idGenerator()
    },
    {
        name : "سه شنبه",
        id : idGenerator()
    },
    {
        name : "دوشنبه",
        id : idGenerator()
    },
    {
        name : "یکشنبه",
        id : idGenerator()
    },
    {
        name : "شنبه",
        id : idGenerator()
    },
];

const HabitPerWeek = ({ match : { params } }) => {
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState(null)
    const [currentTarget , setCurrentTarget] = useState([]);

    useEffect(() => {
        references.target.doc(params.id)
            .get()
            .then(response => {
                setCurrentTarget(response.data());
                return response
            }).then(shit => {
                references.habitPerWeek.doc(params.id)
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
                            references.habitPerWeek.doc(params.id).set({ targetName , color  , schedule : base })
                                .then(_ => {
                                    setLoading(false)
                                })
                    }
                })

            })
    } , [params])  

    console.log(currentTarget , "***");

    const [currentHabitBlock, setCurrentHabitBlock] = useState(null)
    
    
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
    
      const dragStartHandler = (e) => {
        if (e.source.droppableId === "habitItems") {
          setCurrentHabitBlock(e.draggableId);
        }
      };


      useEffect(() => {
        if(!loading) {
            references.habitPerWeek.doc(params.id).update({ targetName : currentTarget.targetName , color : currentTarget.color , schedule })
        }
      } , [schedule])

    return (
        <Loading loading={loading}>
            {isReady => {
                if(isReady) return (
                    <div className="habitPerDay">
            <Container>
            <div className="habitPerDay__header">
            <div>
                <p>Schedule for achieve</p>
                <p>{currentTarget.targetName}</p>
            </div>
            <div>
                <p onClick={currentTarget.doneHandler} className="habitPerDay__done">Done With it</p>
            </div>
            </div>
            <DragDropContext onDragStart={dragStartHandler} onDragEnd={dragEndHandler} >
                <div className="habitPerDay__schedulePlayground">   
                <div className="habitPerDay__weekDay">
                {namesOfDaysOfWeek.map((el, i) => (
                    <Droppable key={i} droppableId={el.name}>
                    {provided => (
                        <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        key={i}
                        className={`habitPerDay__weekDay__item ${currentHabitBlock ? "habitPerDay__weekDay__item--hoverWithHabitInGrab" : ""}`} >
                        <div className="habitPerDay__weekDay__item__innerContainer">
                            <p>{el.name}</p>
                        </div>
                        <>
                            {(() => {
                            return schedule[el.name]?.map((el, i) => (
                                <Draggable
                                key={el.id}
                                draggableId={el.id}
                                index={i}
                                >
                                {(provided) => (
                                    <div
                                    ref={provided.innerRef}
                                    key={i}
                                    className="habitPerDay__weekDay__addedHabit"
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    >
                                    {el.name}
                                    </div>
                                )}
                                </Draggable>
                            ));
                            })()}
                            {provided.placeholder}
                        </>
                        </div>
                    )}
                    </Droppable>
                ))}
                </div>
                <div className={`habitPerDay__habitSidebar ${!isSidebarOpen ? "habitPerDay__habitSidebar--active" : ""}`} >
                <div
                    onClick={() => setIsSidebarOpen(prev => !prev)}
                    className="habitPerDay__habitSidebar__trigger" >
                    {!isSidebarOpen ? <FiChevronLeft/> : <FiChevronRight />}
                </div>
                <div className="ss">
                    <Droppable droppableId="habitItems">
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
                                        {...provided.draggableProps}
                                        >
                                            <div style={{ backgroundColor : `#${currentTarget.color}` }}>
                                                {el.name}
                                                
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
            </div>
            </DragDropContext>
            </Container>
        </div>
                )
            }}
        </Loading>   
    )
}

export default HabitPerWeek;
