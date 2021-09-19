import { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";


import { EmptyHabitBlock , StreamItem, StreamSidebar} from "../components/Stream";

import { idGenerator, selfClearTimeout, _date } from "../utils";


import TodayHoursRow from "../components/TodayHoursRow";
import Alert from "../components/Alert";
import { references } from "../firebase";
import Timeline from "../components/Timeline";
import StreamLoading from "../components/Stream/StreamLoading";


// Static variables
const hours = new Array(24).fill().map((_, i) => i + 1);

const TODAY_ID = "todayHabit";

const Stream = ({ date , sideBarEnabled , setIsTargetStreamReadyToRender }) => {
  const [loading, setLoading] = useState(true);
  const [currentItemInDeleteProcess, setCurrentItemInDeleteProcess] = useState(false);


  const [habitInStream, setHabitInStream] = useState(null);


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [todayHabit, setTodayHabit] = useState([]);
  
  const [isDraggingStart, setIsDraggingStart] = useState(false);

  const [isResizeStart, setIsResizeStart] = useState(false);

  const [sidebarClosedByUser, setSidebarClosedByUser] = useState(false);

  const [isDetailsModeActive, setIsDetailsModeActive] = useState(false);
  const [detailsTimeline, setDetailsTimeline] = useState([]);
  const [timelineHeight, setTimelineHeight] = useState(0);
  const [currentDetailsModeHabit, setCurrentDetailsModeHabit] = useState(null);

  const [shouldOverlayGetVisible, setShouldOverlayGetVisible] = useState(false);
  
  const [injectedTodo, setInjectedTodo] = useState("")
  
  const [firstTime, setFirstTime] = useState(true);

  
  useEffect(() => setFirstTime(false) , []);
  

  const deleteTimeoutRef = useRef(); 


  const leanDate = date.split("/").join('')


  const finishLoadingHandler = () => {
    setIsTargetStreamReadyToRender(true);
    setLoading(false)
  }

  useEffect(() => {
    references.stream.doc(leanDate).onSnapshot(snapShot => {
      if(snapShot.exists) {
          setHabitInStream(snapShot.data().item);
          references.habitPerWeek
          .get()
          .then(res => {
            let ss = _date(date).add(1 , 'day').format('dddd')
            const _s = res.docs.map(el => el.data()).map(el => ({ color : el.color , item : el.schedule[ss] })).filter(el => el.item?.length)
            setTodayHabit(_s)
            finishLoadingHandler()
          })
        }else {
          const curr = hours.map((_) => ({ name: null, id: idGenerator(), hoursGoNext: 1 }))
          references.stream.doc(leanDate).set({ item : curr })
            .then(_ => {
              setHabitInStream(curr)
              references.habitPerWeek
                .get()
                .then(res => {
                  let ss = _date(date).add(1 , 'day').format('dddd');
                  const _s = res.docs.map(el => el.data()).map(el => ({ color : el.color , item : el.schedule[ss] })).filter(el => el.item?.length)
                  setTodayHabit(_s)
                  finishLoadingHandler()
                })
            })
        }
    })
  } , [])

  useEffect(() => {
    if(!firstTime) {
      references.stream.doc(leanDate)
        .update({item : habitInStream})
    }
  } , [habitInStream])



  useEffect(() => {
    if(isSidebarOpen && !loading) {
      setIsTargetStreamReadyToRender(false);
    }else if(!loading){
      setIsTargetStreamReadyToRender(true);
    }
  } , [isSidebarOpen])
  
  
  const dragEndHandler = ({ source, destination, draggableId }) => {
    setIsDraggingStart(false);
    if (!isSidebarOpen && !sidebarClosedByUser) {
      selfClearTimeout(() => setIsSidebarOpen(true), 500);
    }

    if (!destination || destination.index > 23) {
      let needToAssign = true;
      let timer = setTimeout(() => {
        setHabitInStream(prev => prev.map(el => el.id === draggableId ? { id : idGenerator() , name : null , hoursGoNext : 1 } : el))
        deleteTimeoutRef.current = null;
        setCurrentItemInDeleteProcess(null)
        needToAssign = false
        clearTimeout(timer);
      } , 4000);
      if(needToAssign) deleteTimeoutRef.current = timer;
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

        const { color , item } = todayHabit.find(el => el.item.find(el => el.id === draggableId))
        clone[insertIndex] = {
          color,
          name : item.find(el => el.id === draggableId).name,
          id: idGenerator(),
          hoursGoNext: 1,
        };
        return clone;
      } else {
        const habitClone = [...habitInStream];
        const { color , item } =  todayHabit.find(el => el.item.find(el => el.id === draggableId))
        habitClone.splice(insertIndex, 0, {
          color,
          name : item.find(el => el.id === draggableId).name,
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
      }, 250);

      selfClearTimeout(() => {
        setTimelineHeight(possibleStep.length * 100);
      } , 350)
    } else {
      setIsDetailsModeActive(false);
      setTimelineHeight(0);
      setDetailsTimeline([]);
      setCurrentDetailsModeHabit(null);
      streamContainer.overflow = "auto";
    }
  };


  return loading ? "loading" : (
    <div className="today">
      <Timeline />
      {
        shouldOverlayGetVisible && <div className="helperOverlay" />
      }
      {isDetailsModeActive !== false && (
        <div style={{ top: isDetailsModeActive }} className="helperOverlay">
          <span style={{ height: timelineHeight }} className="helperOverlay__timeline">
            <span></span>
          </span>
        </div>
      )}
      <DragDropContext onDragStart={dragStartHandler} onDragEnd={dragEndHandler} >
        <div style={{ overflowX : "hidden" }} id="Container2" className={`todayHoursRow__container ${isDraggingStart || isResizeStart? "todayHoursRow__container--rowInHover": ""}`} >
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
            {(provided , snapshot) => {
              return (
                  <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="today__droppableContainer">
                  {habitInStream.map((el, i) => {
                    if (!el.name) return <EmptyHabitBlock id={el.id} index={i} key={el.id} />
                    else
                      return (
                        <StreamItem
                          deleteTimeoutRef={deleteTimeoutRef}
                          snapshot={snapshot}
                          setCurrentItemInDeleteProcess={setCurrentItemInDeleteProcess}
                          currentItemInDeleteProcess={currentItemInDeleteProcess}
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
              )
            }}
          </Droppable>
        </div>
        {
          sideBarEnabled ?
            <StreamSidebar
              setShouldOverlayGetVisible={setShouldOverlayGetVisible}
              currentDetailsModeHabit={currentDetailsModeHabit}
              injectedTodo={injectedTodo}
              isSidebarOpen={isSidebarOpen}
              setInjectedTodo={setInjectedTodo}
              sideBarHandler={sideBarHandler}
              todayHabit={todayHabit} /> : null
        }
      </DragDropContext>
    </div>
  )
  // return <StreamLoading loading={loading}> 
  //   {isReady => {
  //     if(isReady) {
  //       return (
          
  //       )
  //     }
  //   }}
  // </StreamLoading>
};

export default Stream;
