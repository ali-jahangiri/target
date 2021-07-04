import { useState } from "react";
import Container from "../components/Container";
import { generateColor, idGenerator } from "../utils";

import { DragDropContext , Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect } from "react";

import HabitScheduleBlock from "../components/HabitScheduleBlock";

import { FiChevronLeft , FiChevronRight } from "react-icons/fi";
import { Redirect } from "react-router";

import db from "../firebase";

var ID = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
};


const namesOfDaysOfWeek = [
    {
        name : "جمعه",
        id : ID()
    },
    {
        name : "پنجشنبه",
        id : ID()
    },
    {
        name : "چهارشنبه",
        id : ID()
    },
    {
        name : "سه شنبه",
        id : ID()
    },
    {
        name : "دوشنبه",
        id : ID()
    },
    {
        name : "یکشنبه",
        id : ID()
    },
    {
        name : "شنبه",
        id : ID()
    },
];


const HabitPerDay = ({ location }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [schedule, setSchedule] = useState({});
    const [currentHabitBlock, setCurrentHabitBlock] = useState(null);
    
    useEffect(() => {
        if(location.state) {
            const dayName = {};
            namesOfDaysOfWeek.map(el => dayName[el.name] = []);
            setSchedule(dayName)
        }
    } , [])

    
    if(!location.state) return <Redirect to='/' />

    const { targetName , habit , color } = location.state.target;
       
    const dragEndHandler = ({ destination , ...other }) => {
        setCurrentHabitBlock(null)
        if (!destination) return;
        // TODO handle already have habit

        if(namesOfDaysOfWeek.map(el => el.name).includes(destination.droppableId) && other.source.droppableId !== 'habitItems') {
            return habitOrderHandler(destination , other)
        }

        else if(destination && destination.droppableId !== "habitItems") {
            const selectedHabit = other.draggableId;
            const targetDayColumn = destination.droppableId;

            setSchedule(prev => ({
                ...prev,
                [targetDayColumn] : [
                    ...prev[targetDayColumn],
                    {
                        id: idGenerator(),
                        name: selectedHabit
                    }
                ]
            }));

        }   
    }


    console.log(schedule);


    const habitOrderHandler = (destination , other) => {
        const newOrderScheduleArray = [...schedule[destination.droppableId]];
        const newItem = newOrderScheduleArray.splice(other.source.index, 1);
        newOrderScheduleArray.splice(destination.index , 0 , ...newItem);

        setSchedule(prev => ({
            ...prev,
            [destination.droppableId] : newOrderScheduleArray
        }))
    }


    const dragStartHandler = (e) => {
        if(e.source.droppableId === "habitItems") {
            setCurrentHabitBlock(e.draggableId)
        }
    }


    const doneHandler = () => {
        db.collection("target")
            .add({schedule})
            .then(data => {

            })
    }

    return (
        <div className="habitPerDay">
            <Container>
                <div className="habitPerDay__header">
                    <div>
                        <p>Schedule for achieve</p>
                        <p>{targetName}</p>
                    </div>
                    <div>
                        <p onClick={doneHandler} className="habitPerDay__done">Done With it</p>
                    </div>
                </div>
            <DragDropContext 
                onDragStart={dragStartHandler} 
                onDragEnd={dragEndHandler}>
                <div className="habitPerDay__schedulePlayground">
                    <div className="habitPerDay__weekDay">
                        {
                            namesOfDaysOfWeek.map((el , i) => (
                                <Droppable key={i} droppableId={el.name} >
                                    {provided => (
                                        <div 
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            key={i} 
                                            className={`habitPerDay__weekDay__item ${currentHabitBlock ? "habitPerDay__weekDay__item--hoverWithHabitInGrab" : ""}`}>
                                            <div className="habitPerDay__weekDay__item__innerContainer">
                                                <p>{el.name}</p>
                                            </div>
                                            <div>
                                                {
                                                    schedule[el.name]
                                                        ?.map((el , i) => (
                                                            <Draggable key={i} draggableId={el + i * i} index={i} >
                                                                {provided => (
                                                                        <div
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            ref={provided.innerRef}
                                                                            className="habitPerDay__weekDay__addedHabit" key={i}>
                                                                            {el.name}
                                                                        </div>
                                                                    )
                                                                }
                                                            </Draggable>
                                                        ))
                                                }
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))
                        }
                    </div>
                    <div className={`habitPerDay__habitSidebar ${!isSidebarOpen ? "habitPerDay__habitSidebar--active" : ""}`}>
                        <div onClick={() => setIsSidebarOpen(prev => !prev)} className="habitPerDay__habitSidebar__trigger">
                            {
                                !isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />
                            }
                        </div>
                        <div className="ss">
                            <Droppable droppableId="habitItems">
                                {provided => (
                                    <div 
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}>
                                        {
                                            habit.map((el , i) => (
                                                <HabitScheduleBlock
                                                    picked={currentHabitBlock}
                                                    index={i}
                                                    draggableId={el.name}
                                                    key={i}
                                                />
                                            ))
                                        }
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
}


export default HabitPerDay;