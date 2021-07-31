import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FiChevronLeft, FiLock, } from "react-icons/fi";


import { EmptyHabitBlock , Todo , StreamItem, StreamSidebar} from "../components/Stream";

import { idGenerator, selfClearTimeout } from "../utils";


import TodayHoursRow from "../components/TodayHoursRow";
import Alert from "../components/Alert";
import { useDispatch, useSelector } from "../Store/Y-State";
import { setStream } from "../Store/slices/streamSlice";

// Static variables
const hours = new Array(24).fill().map((_, i) => i + 1);

const TODAY_ID = "todayHabit";

const Stream = ({ date , sideBarEnabled }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(sideBarEnabled);
  
  const todayHabit = useSelector(state => Object.values(state.target).map(({ color , habit }) => ({ color , habit })));
  
  const [isDraggingStart, setIsDraggingStart] = useState(false);

  const [isResizeStart, setIsResizeStart] = useState(false);

  const [sidebarClosedByUser, setSidebarClosedByUser] = useState(false);

  const [isDetailsModeActive, setIsDetailsModeActive] = useState(false);
  const [detailsTimeline, setDetailsTimeline] = useState([]);
  const [timelineHeight, setTimelineHeight] = useState(0);
  const [currentDetailsModeHabit, setCurrentDetailsModeHabit] = useState(null);

  const habitInStreamInsideStore = useSelector(state => state.stream[date] || hours.map((_) => ({ name: null, id: idGenerator(), hoursGoNext: 1 })))

  const [habitInStream, setHabitInStream] = useState(() => habitInStreamInsideStore);


  const [injectedTodo, setInjectedTodo] = useState("")
  
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => setFirstTime(false) , []);
  const storeDispatcher = useDispatch();



  useEffect(() => {
    console.log(habitInStream , "habitInStream");
    if(!firstTime) {
      storeDispatcher(setStream({ id : date , items : habitInStream }))
    }
  } , [habitInStream])


  const dragEndHandler = ({ source, destination, draggableId }) => {
    setIsDraggingStart(false);
    if (!isSidebarOpen && !sidebarClosedByUser) {
      selfClearTimeout(() => setIsSidebarOpen(true), 500);
    }

    if (!destination || destination.index > 23) {
      Alert.warning("you cannot put your outside of today hours");
      return;
    }

    if (source.droppableId === TODAY_ID)
      return reorderHandler(destination, source);

    if(draggableId === "injectedTodo") {
      return todoInjectionHandler(destination, source)
    }
    let insertIndex = destination.index;
    setHabitInStream((prev) => {
      const clone = [...prev];
      if (!clone[insertIndex].name) {
        const _targetHabit = todayHabit.find(el => el.habit.some(el => el.id === draggableId));
        clone[insertIndex] = {
          color : _targetHabit.color,
          name : _targetHabit.habit.find(el => el.id === draggableId).name,   
          id: idGenerator(),
          hoursGoNext: 1,
        };
        return clone;
      } else {
        const habitClone = [...habitInStream];
        const _targetHabit =  todayHabit.find(el => el.habit.some(el => el.id === draggableId));
        habitClone.splice(insertIndex, 0, {
          color : _targetHabit.color,
          name : _targetHabit.habit.find(el => el.id === draggableId).name,
          id: idGenerator(),
          hoursGoNext: 1,
        });
        return habitClone;
      }
    });
  };

  const todoInjectionHandler = (destination, source) => {
    let insertIndex = destination.index;
    setHabitInStream((prev) => {
      const clone = [...prev];
      if (!clone[insertIndex].name) {
        clone[insertIndex] = {
          name : injectedTodo,
          color : "988989",
          id: idGenerator(),
          hoursGoNext: 1,
        };
        return clone;
      } else {
        const habitClone = [...habitInStream];
        habitClone.splice(insertIndex, 0, {
          name : injectedTodo,
          color : "988989",
          id: idGenerator(),
          hoursGoNext: 1,
        });
        return habitClone;
      }
    });
  }

  const dragStartHandler = ({ source }) => {
    setIsDraggingStart(true);
    if (source.droppableId === TODAY_ID || source.droppableId === "injectedTodo") setIsSidebarOpen(false);
  };

  const reorderHandler = (destination, other) => {
    const habitClone = [...habitInStream];
    const [removed] = habitClone.splice(other.index, 1);
    habitClone.splice(destination.index, 0, removed);
    setHabitInStream(habitClone);
  };

  const resizeHandler = ({ height, index }) => {
    if (habitInStream[index].hoursGoNext + index === 24) {
      Alert.warning("your habit cannot ross over today hours");
      return;
    }
    const wasUnderValidH = height <= 0 && habitInStream[index].hoursGoNext === 1 ? true : false;
    if (height && !wasUnderValidH) {
      let floatedHours = Math.round(height >= 100 ? height / 100 : height / 100);
      setHabitInStream((prev) => prev.map((el, i) => i === index ? { ...el, hoursGoNext: el.hoursGoNext + floatedHours } : el ));
    }
  };

  const sideBarHandler = () => {
    setSidebarClosedByUser(true);
    setIsSidebarOpen((prev) => !prev);
  };


  const detailsShowHandler = (id, possibleStep) => {
    const streamContainer = document.getElementsByClassName("mainContainer")[0].style;



    if (!isDetailsModeActive) {
      setCurrentDetailsModeHabit(id);
      
      selfClearTimeout(() => {
        streamContainer.overflow = "hidden";
        setDetailsTimeline(possibleStep);
        const scroll = document.getElementsByClassName('mainContainer')[0].scrollTop;
        setIsDetailsModeActive(scroll);
        setTimelineHeight(possibleStep.length * 100);
      }, 250);
    } else {
      setIsDetailsModeActive(false);
      setTimelineHeight(0);
      setDetailsTimeline([]);
      setCurrentDetailsModeHabit(null);
      streamContainer.overflow = "auto";
    }
  };

  // const currentYPage = useRef(window.pageYOffset);

  // const scrollHelperOnResizeHandler = ({ pageY }) =>  {
  //   console.log(isResizeStart , "----------");
  //   // console.log(pageY ,"**" , isResizeStart);
  //   if(isResizeStart) {
  //   }
  // }
  // // const scrollHelperOnResizeHandler = debounce(({ pageY }) => {
  // //   if(isResizeStart) {
    // //     console.log(pageY ,"**");
    // //   }
    // // } , 0)
  
  // useLayoutEffect(() => {
  //   let timer = setInterval(() => {
  //     if (currentYPage.current <= 2400) {
  //       currentYPage.current += 100;
  //       window.scroll({
  //         top: currentYPage.current,
  //         behavior: "smooth",
  //       });
  //     } else {
  //       clearTimeout(timer);
  //     }
  //   }, 3.6e6);



  //   return () => {
  //     clearInterval(timer);
  //     // window.removeEventListener("mousemove", (_) => {});
  //   };
  // }, []);

  return (
    <div className="today">
      {isDetailsModeActive !== false && (
        <div style={{ top: isDetailsModeActive }} className="helperOverlay">
          <span style={{ height: timelineHeight }} className="helperOverlay__timeline">
            <span></span>
          </span>
        </div>
      )}
      <DragDropContext onDragStart={dragStartHandler} onDragEnd={dragEndHandler} >
        <div id="Container2" className={`todayHoursRow__container ${isDraggingStart || isResizeStart? "todayHoursRow__container--rowInHover": ""}`} >
          <div id="Container" style={{ position: "relative", zIndex: currentDetailsModeHabit ? 50000 : 5}}>
            {hours.map((el, i) => (
              <TodayHoursRow
                indexInTimeline={detailsTimeline.includes(el) && detailsTimeline.indexOf(el)}
                isInTimeLine={detailsTimeline.includes(el)}
                index={el}
                key={i}
              />
            ))}
          </div>

          <Droppable droppableId={TODAY_ID}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="today__droppableContainer">
                {habitInStream.map((el, i) => {
                  if (!el.name) return <EmptyHabitBlock id={el.id} index={i} key={el.id} />
                  else
                    return (
                      <StreamItem
                        isInDetailsMode={currentDetailsModeHabit === el.id ? true : false}
                        detailsShowHandler={detailsShowHandler}
                        sidebarClosedByUser={sidebarClosedByUser}
                        isInResizing={isResizeStart}
                        isInDragging={isDraggingStart}
                        setNthChildHandler={setIsResizeStart}
                        setIsSidebarOpen={setIsSidebarOpen}
                        resizeHandler={resizeHandler}
                        index={i}
                        hoursGoNext={el.hoursGoNext}
                        id={el.id}
                        color={el?.color}
                        habitName={el.name}
                        key={el.id}
                        habitInStream={habitInStream}
                        setHabitInStream={setHabitInStream}
                      />
                    );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        {
          sideBarEnabled ?
            <StreamSidebar 
              currentDetailsModeHabit={currentDetailsModeHabit}
              injectedTodo={injectedTodo}
              isSidebarOpen={isSidebarOpen}
              setInjectedTodo={setInjectedTodo}
              sideBarHandler={sideBarHandler}
              todayHabit={todayHabit} /> : null
        }
      </DragDropContext>
    </div>
  );
};

export default Stream;
