import { useEffect } from "react";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FiChevronLeft } from "react-icons/fi"

import db from "../firebase";
import { habitForTodayExtractor, idGenerator } from "../utils";


import { Resizable} from "re-resizable";

import TodayHoursRow from "../components/TodayHoursRow";
import { LoadingPage } from "../Pages"






// Static variables
const hours = new Array(24).fill().map((_ , i) => i + 1)
const TODAY_ID = "todayHabit";



const NonValidHabitFiller = ({ index , id }) => {
    return (
        <Draggable draggableId={id} isDragDisabled index={index} >
            {provided => (
                <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="today__nonValidHabit"></div>
            )}
        </Draggable>
    )
}



const HabitInStreamItem = ({ id , index , color , habitName , resizeHandler, hoursGoNext }) => {
    return (
        <Draggable  draggableId={id} index={index} >
            {provided => (
                 <Resizable 
                 className='habitMainContainer' 
                 enable={{ bottom : true}} 
                 maxWidth="80%" 
                 minWidth={'80%'} 
                 grid={[100 , 100]}
                 onResizeStop={(e, direction, ref, d) => resizeHandler({ id , height : d.height , index })} 
                 defaultSize={{
                 width: '80%',
                 height : hoursGoNext * 100
             }}>
                 <div 
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="today__habitInStreamItem">
                    <div className="today__habitInStreamItem__container" style={{ backgroundColor : `#${color || "dcdcdc"}` }}>
                        {habitName}
                    <div className="resizeTrigger"></div>
                    </div>
                </div>
             </Resizable>
            )}
        </Draggable>
    )
}

const Today = () => {
    const [todayHabit, setTodayHabit] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    const [habitInStream, setHabitInStream] = useState(hours.map(_ => ({ name : null , id : idGenerator() })));
    const [isDraggingStart, setIsDraggingStart] = useState(false)
    const [currentHabitBlock, setCurrentHabitBlock] = useState(null);


    useEffect(() => {
        db.collection("target").onSnapshot(snapshot => {
            setTodayHabit(habitForTodayExtractor(snapshot.docs.map(el => ({...el.data() }))));
            setLoading(false);
        })
    } , []);

    const dragEndHandler = ({ source , destination , draggableId }) => {
        setIsDraggingStart(false);
        if(currentHabitBlock) {
            ['leftRotate' , "rightRotate"]
                .map(el => currentHabitBlock.classList.remove(`sliderHabitBlock__habitItem--${el}`))  
        }
        
        if (!destination) return;

        if(source.droppableId === TODAY_ID)  
                return reorderHandler(destination , source);

        let insertIndex = destination.index;
        setHabitInStream(prev => {
            const clone = [...prev];
            if(!clone[insertIndex].name) {
                clone[insertIndex] = {...todayHabit.find(el => el.id === draggableId) , id : idGenerator() , hoursGoNext: 1};
                return clone
            }else {
                console.log('ressss');
                return prev
            }
        })
    }


    const reorderHandler = (destination, other) => {
        const habitClone = [...habitInStream];
        const [removed] = habitClone.splice(other.index , 1);
        habitClone.splice(destination.index , 0 , removed);
        setHabitInStream(habitClone);
    }


    const resizeHandler = ({height , index , id }) => {
        if(height) {
            if(height >= 100) {
                let hoursWasPassed = height / 100;
                console.log(index + 1, 'want pass' , hoursWasPassed , "step" , 'with id of' , id);
            }else {

            }
        }
    }


    useEffect(() => {
        console.log('STREAM' , habitInStream);
    } , [habitInStream])



    return loading ? <LoadingPage /> : 
    <div className='today'>
        <DragDropContext 
                onDragStart={() => setIsDraggingStart(true)} 
                onDragEnd={dragEndHandler}>
                <div style={{ height : 100 * 24 }} className={`todayHoursRow__container ${isDraggingStart ? "todayHoursRow__container--rowInHover" : ""}`}>
                    <div>
                    {
                        hours.map((el , i ) => <TodayHoursRow index={el} key={i} />)
                    }
                    </div>
                    <div className="bigContainer">
                        {

                        }
                        <Droppable droppableId={TODAY_ID} >
                            {provided => {
                                return (
                                    <div
                                        ref={provided.innerRef}  
                                        {...provided.droppableProps}
                                        className="today__droppableContainer">
                                        {
                                            habitInStream.map((el , i) => {
                                                if(!el.name) return <NonValidHabitFiller id={el.id} index={i} key={el.id} />
                                                else return (
                                                    <HabitInStreamItem
                                                        resizeHandler={resizeHandler}
                                                        index={i}
                                                        id={el.id}
                                                        color={el?.color}
                                                        habitName={el.name}
                                                        key={el.id} />
                                                )
                                            })
                                        }
                                        {provided.placeholder}
                                    </div>
                            )}}
                        </Droppable>
                    </div>
                </div>
                <div className={`today__habitSidebar today__habitSidebar--${isSidebarOpen ? "open" : "close"}`}>
                    <div onClick={() => setIsSidebarOpen(prev => !prev)} className="today__habitSidebar__closeTrigger">
                        <FiChevronLeft color="rgb(82, 82, 82)" />
                    </div>
                    <div className="today__habitSidebar__habitDirectory">
                        <Droppable isDropDisabled droppableId={"fromHabitList"}>
                            {provided => (
                                    <div 
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}>
                                    {
                                        todayHabit.map((el , i) => (
                                            <Draggable key={i} draggableId={el.id} index={i} >
                                                    {provided => (
                                                        <div 
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="sliderHabitBlock__habitItem">
                                                            <div onMouseDown={({ currentTarget , nativeEvent }) => {
                                                                let className = 'sliderHabitBlock__habitItem';
                                                                setCurrentHabitBlock(currentTarget);
                                                                let x = nativeEvent.offsetX;
                                                                if(x >= 105 && x <= 205) return;
                                                                if(x > 105) {
                                                                    currentTarget.classList.add(`${className}--leftRotate`);
                                                                    currentTarget.classList.remove(`${className}--rightRotate`);
                                                                }else{
                                                                    currentTarget.classList.add(`${className}--rightRotate`)
                                                                    currentTarget.classList.remove(`${className}--leftRotate`)
                                                                }
                                                            }}
                                                            
                                                            style={{ backgroundColor : `#${el.color || "dcdcdc"}` }} className="sliderHabitBlock__habitItem__container">
                                                                <p>{el.name}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                            </Draggable>
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