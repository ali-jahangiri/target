import { useState } from "react";
import Container from "../components/Container";
import { generateColor } from "../utils";

import { DragDropContext , Droppable , Draggable } from "react-beautiful-dnd";
import { useEffect } from "react";

var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
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



const HabitPerDay = ({ location : { state: { target } } }) => {
    const { targetName , habit , color } = target;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);


    const newHabit = habit.map(el => ({ value : el , id : ID() }))

    const [schedule, setSchedule] = useState({});


    useEffect(() => {
        const dayName = {};
        namesOfDaysOfWeek.map(el => dayName[el] = null);
        setSchedule(dayName)
    } , [])



    const dragEndHandler = ({ draggableId }) => {
        console.log(draggableId);
    }


    return (
        <div style={{ backgroundColor : `#${generateColor(color , 5)}` }} className="habitPerDay">
            <Container>
                <div className="habitPerDay__header">
                    <p>Schedule for achieve</p>
                    <p>{targetName}</p>
                </div>
            <DragDropContext onDragEnd={dragEndHandler}>
                <div className="habitPerDay__schedulePlayground">
                    <div className="habitPerDay__weekDay">
                        {
                            namesOfDaysOfWeek.map((el , i) => (
                                <Droppable key={i} droppableId={el.id}>
                                    {provided => (
                                        <div 
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            key={i} 
                                            className="habitPerDay__weekDay__item">
                                            <div className="habitPerDay__weekDay__item__innerContainer">
                                                <p>{el.name}</p>
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))
                        }
                    </div>
                    <div className={`habitPerDay__habitSidebar ${isSidebarOpen ? "habitPerDay__habitSidebar--active" : ""}`}>
                        <div className="habitPerDay__habitSidebar__trigger">
                            <p onClick={() => setIsSidebarOpen(prev => !prev)}>Close</p>
                        </div>
                        <div className="ss">
                            <Droppable droppableId="items">
                                {provided => {
                                    return (
                                        <div 
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}>
                                                {
                                                    [...newHabit].map((el , i) => (
                                                        <Draggable 
                                                            draggableId={el.value} 
                                                            key={i} 
                                                            index={i * i}>
                                                            {provided => (
                                                                <div
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    ref={provided.innerRef}
                                                                    key={i}
                                                                    className="habitPerDay__habitSidebar__item">
                                                                    {el.value}
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                }
                                        </div>
                                    )
                                }}
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