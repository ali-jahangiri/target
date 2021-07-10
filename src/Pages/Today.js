import { useEffect } from "react";
import { useState } from "react";
import TodayHoursRow from "../components/TodayHoursRow";
import db from "../firebase";

import { FiChevronLeft } from "react-icons/fi"

import { habitForTodayExtractor } from "../utils";


import { LoadingPage } from "../Pages"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const hours = new Array(24).fill().map((_ , i) => i + 1)


const SliderHabitBlock = ({ habitsForToday , color , }) => {
    return (
        <div className="sliderHabitBlock">
            {
                habitsForToday.map((el , i) => (
                    <Draggable key={i} draggableId={el.id} index={i}>
                        {provided => (
                            <div 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{ backgroundColor : `#${color || "b9b9b9"}` }} 
                                className="sliderHabitBlock__habitItem">
                                <p>{el.name}</p>
                            </div>
                        )}
                    </Draggable>
                ))
            }
        </div>
    )
}


const Today = () => {
    const [todayHabit, setTodayHabit] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        db.collection("target").onSnapshot(snapshot => {
            const todayHabit = habitForTodayExtractor(snapshot.docs.map(el => ({ id : el.id , data : el.data() })));
            setTodayHabit(todayHabit);
            setLoading(false);
        })
    } , []);

    const dragEndHandler = () => {

    }

    return loading ? <LoadingPage /> : 
    <div className='today'>
        <DragDropContext onDragEnd={dragEndHandler}>
                <div className="today__introHeader">  
                <p>you have these habit for today</p>
                </div>
                <div style={{ height : 100 * 24 }} className="todayHoursRow__container">
                    <div>
                    {
                        hours.map((el , i ) => <TodayHoursRow index={el} key={i} />)
                    }
                    </div>
                    <Droppable droppableId="todayHabit" >
                        {provided => {
                            return (
                                <div
                                    ref={provided.innerRef}  
                                    {...provided.droppableProps}
                                    className="place"> 
                                    {provided.placeholder}
                                </div>
                        )}}
                    </Droppable>
                </div>
                <div className={`today__habitSidebar today__habitSidebar--${isSidebarOpen ? "open" : "close"}`}>
                    <div onClick={() => setIsSidebarOpen(prev => !prev)} className="today__habitSidebar__closeTrigger">
                        <FiChevronLeft color="rgb(82, 82, 82)" />
                    </div>
                    <div className="today__habitSidebar__habitDirectory">
                        <Droppable droppableId={"fromHabitList"}>
                            {provided => (
                                    <div 
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}>
                                    {
                                        todayHabit.map((el , i) => (
                                            <SliderHabitBlock {...el} key={i} />
                                        ))
                                    }
                                    {provided.placeholder}
                                    </div>
                                )
                            }
                        </Droppable>
                    </div>
                </div>
            </DragDropContext>
        </div>
}


export default Today;