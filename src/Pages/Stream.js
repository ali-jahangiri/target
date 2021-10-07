import { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";


import { debounce, deepClone, idGenerator, requests, selfClearTimeout, _date } from "../utils";

import RoutineStream from "../components/Stream/RoutineStream";

import { EmptyHabitBlock , StreamItem, StreamSidebar} from "../components/Stream";
import TodayHoursRow from "../components/TodayHoursRow";
import Alert from "../components/Alert";
import Timeline from "../components/Timeline";

import { references } from "../firebase";
import useKeyBaseState from "../Hook/useKeyBaseState";
import PreventUserInteractOverlay from "../components/Stream/PreventUserInteractOverlay";

// Static variables
const hours = new Array(24).fill().map((_, i) => i + 1);
const TODAY_ID = "todayHabit";


const Stream = ({ date , sideBarEnabled , setIsTargetStreamReadyToRender , isDisable }) => {
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
  const [timelineDetails , setTimelineDetails] = useKeyBaseState({})
  const [currentDetailsModeHabit, setCurrentDetailsModeHabit] = useState(null);
  const [shouldOverlayGetVisible, setShouldOverlayGetVisible] = useState(false);
  const [isOverlayInHideProcess, setIsOverlayInHideProcess] = useState(false);
  const [injectedTodo, setInjectedTodo] = useState("")
  const [firstTime, setIsFirstTme] = useState(true)

  const [activeBlockList, setActiveBlockList] = useState([]);

  const [isInInitialActiveBlockList, setIsInInitialActiveBlockList] = useState(true);

  const mainContainerRef = useRef();

  const deleteTimeoutRef = useRef();

  const leanDate = date.split("/").join('')

  const finishLoadingHandler = () => {
    setIsTargetStreamReadyToRender(true);
    setLoading(false)
  }

  useEffect(function streamInitializer() {
    references.stream.doc(leanDate).onSnapshot(snapShot => {
      if(snapShot.exists) {
        references.habitPerWeek
        .get()
        .then(res => {
          let ss = _date(date).add(2 , 'day').format('dddd')
          const _s = res.docs.map(el => el.data()).map(el => ({ color : el.color , item : el.schedule[ss] })).filter(el => el.item?.length)
          setTodayHabit(_s)
          setHabitInStream(snapShot.data().item);
          finishLoadingHandler()
          })
        }else {
          requests.routine.getRoutineList(_date(date).add(2 , 'day').format('dddd') , response => {
          const curr = hours.map((_) => ({ name: null, id: idGenerator(), hoursGoNext: 1 }));
          if(response?.list?.length) {
            response.list.map(routine => (
              curr[routine.hour.from] = { ...routine , type : "routine" , hoursGoNext : routine.hour.to - routine.hour.from }
            ))
          }
          references.stream.doc(leanDate).set({ item : curr })
              .then(_ => {
                setHabitInStream(curr)
                references.habitPerWeek
                  .get()
                  .then(res => {
                    let ss = _date(date).add(2 , 'day').format('dddd');
                    const _s = res.docs.map(el => el.data()).map(el => ({ color : el.color , item : el.schedule[ss] })).filter(el => el.item?.length)
                    setTodayHabit(_s)
                    finishLoadingHandler()
                  })
              })
          })
        }
    })
  } , [date])

  useEffect(function syncStream () {
    if(!firstTime) {
      references.stream.doc(leanDate)
        .update({item : habitInStream})
    }else {
      setIsFirstTme(false)
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

  const todoInjectionHandler = destination => {
    let insertIndex = destination.index;
    setHabitInStream((prev) => {
      const clone = [...prev];
      if (!clone[insertIndex].name) {
        clone[insertIndex] = {
          name : injectedTodo,
          color : "3b3b3b",
          id: idGenerator(),
          hoursGoNext: 1,
        };
        return clone;
      } else {
        const habitClone = [...habitInStream];
        habitClone.splice(insertIndex, 0, {
          name : injectedTodo,
          color : "3b3b3b",
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
      Alert.warning("your habit cannot cross over today hours");
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

  const detailsShowHandler = (id, possibleStep , elementRef) => {
    const streamContainer = document.getElementsByClassName("mainContainer")[0].style;

    if (!isDetailsModeActive) {
      setCurrentDetailsModeHabit(id);
      setIsTargetStreamReadyToRender(false)
      selfClearTimeout(() => {
        streamContainer.overflow = "hidden";
        setDetailsTimeline(possibleStep);
        const scroll = document.getElementsByClassName('mainContainer')[0].scrollTop;
        setIsDetailsModeActive(scroll);
      }, 500);
      selfClearTimeout(() => {
        setTimelineDetails("height" , possibleStep.length * 100)
        const haveTopDistance = elementRef.getClientRects()[0].top;
        if(haveTopDistance) setTimelineDetails("topPosition" , haveTopDistance);
        
      } , 600);
    } else {
      setIsOverlayInHideProcess(true)
      selfClearTimeout(() => {
        setIsOverlayInHideProcess(false)
        setIsDetailsModeActive(false);
      } , 2000)
      setTimelineDetails({});
      setDetailsTimeline([]);
      setCurrentDetailsModeHabit(null);
      setIsTargetStreamReadyToRender(true)
      streamContainer.overflow = "auto";
    }
  };

  const addToActiveBlockHandler = newActiveBlock => {
    setActiveBlockList(prev => [...prev , newActiveBlock]);
  }


  const debouncedScrollToActiveBlockHandler = useCallback(debounce((passedSyncedList = []) => {
    const currentHour = new Date().getHours();
    const mainParentContainerRef = document.querySelector('.mainContainer');
    
    if(passedSyncedList.length) {
      if(passedSyncedList.some(el => el.isInDoing)) {
        mainParentContainerRef.scrollTo({ top : passedSyncedList.find(el => el.isInDoing).startPointPosition * 100 , behavior : "smooth" })
      }else {
        const sortedActiveList = deepClone(passedSyncedList).sort((a , b) => a.startPointPosition - b.startPointPosition).sort((_ , b) => b.startPointPosition - currentHour);
        mainParentContainerRef.scrollTo({ top : sortedActiveList[0].startPointPosition * 100 , behavior : "smooth" })
      }
      setIsInInitialActiveBlockList(false);
    }else {
      selfClearTimeout(() => {
        const currentTimelinePosition = ((currentHour > 0 ? currentHour - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666);
        mainParentContainerRef.scrollTo({ top : currentTimelinePosition , behavior : "smooth" });
      } , 700);
    }
  } , 250) , []);

  useEffect(() => isInInitialActiveBlockList && debouncedScrollToActiveBlockHandler(activeBlockList) , [activeBlockList]);

  return loading ? <div className="today__loadingScreen" /> : (
    <div className="today">
      <Timeline shouldGoToCurrentHour={!isDisable || !activeBlockList} />
        {
          isDisable && <PreventUserInteractOverlay protectFrom={mainContainerRef.current} />
        }
        {
          shouldOverlayGetVisible && <div className="helperOverlay" />
        }
      {isDetailsModeActive !== false && (
        <div style={{ top: isDetailsModeActive }} className={`helperOverlay ${isOverlayInHideProcess ? "helperOverlay--inDestroyProcess" : ""}`}>
          <span style={{ height: timelineDetails.height , top : timelineDetails.topPosition }} className={`helperOverlay__timeline ${timelineDetails.topPosition ? "helperOverlay__timeline--haveTopDistance" : ""}`}>
            <span></span>
          </span>
        </div>
      )}
      <DragDropContext onDragStart={dragStartHandler} onDragEnd={dragEndHandler} >
        <div ref={mainContainerRef} id="Container2" className={`todayHoursRow__container ${isDraggingStart || isResizeStart? "todayHoursRow__container--rowInHover": ""}`} >
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
                    else if(el.type === "routine") return <RoutineStream index={i} key={i} {...el} />
                    else return (
                        <StreamItem
                          addToActiveBlockHandler={addToActiveBlockHandler}
                          leanDate={leanDate}
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
          !isDisable && sideBarEnabled && (
            <StreamSidebar
              habitInStream={habitInStream.filter(el => el.name)}
              isDraggingStart={isDraggingStart}
              leanDate={leanDate}
              setShouldOverlayGetVisible={setShouldOverlayGetVisible}
              currentDetailsModeHabit={currentDetailsModeHabit}
              injectedTodo={injectedTodo}
              isSidebarOpen={isSidebarOpen}
              setInjectedTodo={setInjectedTodo}
              sideBarHandler={sideBarHandler}
              todayHabit={todayHabit} /> )
        }
      </DragDropContext>
    </div>
  )
};

export default Stream;
