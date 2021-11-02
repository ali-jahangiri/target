import ReactGridLayout from "react-grid-layout";
import { colors, deepClone, getRandomItem, requests } from "../../utils";
import React from "react";
import StreamHour from "./StreamHour";
import { useState } from "react";
import { useEffect } from "react";
import StreamSidebar from "./StreamSidebar";


// const { TODAY_ID , INJECTED_TODO , hours , HABIT_LIST_ID } = client.STATIC;

// const AfterAllChildRenderSettled = ({ setAllChildRender , showControllerHandler }) => {
//   useEffect(() => {
//     setAllChildRender(true);
//     showControllerHandler(true);
//   } , []);
//   return null
// }

const Box = ({ children , ref , ...rest }) => {
  return (
    <div ref={ref} {...rest} className='TestHandler react-resizable-handle '>
    </div>
  )
}

const TER = React.forwardRef(({ children, ...props }, ref) => {
  
  return (
    <Box ref={ref} {...props} >
      {children}
    </Box>
  )
})


const Stream = ({ 
  date ,
  setIsStreamControllerVisible ,
  isDisable ,
  isNextDayAfterToday,
  parentNodeRef ,
  isToday
}) => {
  const [loading, setLoading] = useState(true);
  const [streamItem, setStreamItem] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [todayHabit, setTodayHabit] = useState([]);
  // const [currentItemInDeleteProcess, setCurrentItemInDeleteProcess] = useState(false);
  // const [isInDragging, setIsInDragging] = useState(false);
  // const [isResizeStart, setIsResizeStart] = useState(false);
  const [sidebarClosedByUser, setSidebarClosedByUser] = useState(false);
  // const [isDetailsModeActive, setIsDetailsModeActive] = useState(false);
  // const [detailsTimeline, setDetailsTimeline] = useState([]);
  // const [timelineDetails , setTimelineDetails] = useState({})
  const [currentDetailsModeHabit, setCurrentDetailsModeHabit] = useState(null);
  const [shouldOverlayGetVisible, setShouldOverlayGetVisible] = useState(false);
  // const [isOverlayInHideProcess, setIsOverlayInHideProcess] = useState(false);
  const [injectedTodo, setInjectedTodo] = useState("")
  const [isFirstRender, setIsFirstRender] = useState(true);

  // const [activeBlockList, setActiveBlockList] = useState([]);
  // const [allChildrenGetRender, setAllChildrenGetRender] = useState(false);
  // const [initialHelperScrollGetCompleted, setInitialHelperScrollGetCompleted] = useState(false);
    
  // const mainContainerRef = useRef();
  // const deleteTimeoutRef = useRef();

  

  // useEffect(() => {
  //   if(isSidebarVisible && !loading) {
  //     setIsStreamControllerVisible(false);
  //   }else if(!loading){
  //     setIsStreamControllerVisible(true);
  //   }
  // } , [isSidebarVisible])


  // const dragEndHandler = ({ source, destination, draggableId }) => {
  //   setIsInDragging(false);
  //   if (!isSidebarVisible && !sidebarClosedByUser) {
  //     selfClearTimeout(() => setIsSidebarVisible(true) , 500);
  //   }
    
  //   // delete process
  //   // if (!destination || destination.index > 23) {
  //   //   let needToAssign = true;
  //   //   let timer = setTimeout(() => {
  //   //     setHabitInStream(prev => prev.map(el => el.id === draggableId ? { id : idGenerator() , name : null , hoursGoNext : 1 } : el))
  //   //     deleteTimeoutRef.current = null;
  //   //     setCurrentItemInDeleteProcess(null)
  //   //     needToAssign = false
  //   //     clearTimeout(timer);
  //   //   } , 4000);
  //   //   if(needToAssign) deleteTimeoutRef.current = timer;
  //   //   return;
  //   // }
    
  //   if (source.droppableId === TODAY_ID) return reorderHandler(destination, source);
  //   if(draggableId === INJECTED_TODO) return todoInjectionHandler(destination, source);

  //   setStreamItem(prev => createNewStreamItem(prev , todayHabit , destination.index, draggableId));
  // };

  // const todoInjectionHandler = destination => {
  //   setStreamItem(prev => createNewTodo(prev , destination.index , injectedTodo));
  // }

  // const reorderHandler = (destination, source) => 
  //   setStreamItem(reorderStreamItem(streamItem , destination.index , source.index));

  // const dragStartHandler = ({ source : { droppableId } }) => {
  //   setIsInDragging(true);
  //   if(droppableId === HABIT_LIST_ID) sideBarHandler();
  // };

  
  
  // const resizeHandler = ({ height, index }) => {
  //   if (streamItem[index].hoursGoNext + index === 24) {
  //     Alert.warning("your habit cannot cross over today hours");
  //     return;
  //   }
  //   const wasUnderValidH = height <= 0 && streamItem[index].hoursGoNext === 1 ? true : false;
  //   if (height && !wasUnderValidH) {
  //     let floatedHours = Math.round(height >= 100 ? height / 100 : height / 100);
  //     setStreamItem(prev => prev.map((el, i) => i === index ? { ...el, hoursGoNext: el.hoursGoNext + floatedHours } : el ));
  //   }
  // };

  const sideBarHandler = () => {
    setSidebarClosedByUser(true);
    setIsSidebarVisible(prev => {
      if(!prev) setShouldOverlayGetVisible(true);
      else if(shouldOverlayGetVisible) setShouldOverlayGetVisible(false);
      return !prev
    });
  };

  // const detailsShowHandler = (blockId, possibleStep = [] , itemTopDistance) => {
  //   if (!isDetailsModeActive && possibleStep.length) {
  //     setCurrentDetailsModeHabit(blockId);
  //     setIsStreamControllerVisible(false)
  //     selfClearTimeout(() => {
  //       setDetailsTimeline(possibleStep);
  //       const scroll = client.nodeRef.home().scrollTop;
  //       setIsDetailsModeActive(scroll);
  //     }, 500);
  //     setTimelineDetails({ topPosition : itemTopDistance })
  //     selfClearTimeout(() => {
  //       setTimelineDetails({height : possibleStep.length * 100 , topPosition : itemTopDistance });
  //     } , 500);
  //   } else {

  //     setIsOverlayInHideProcess(true)
  //     setTimelineDetails({
  //       height: 0,
  //       top : 0
  //     });
  //     setDetailsTimeline([]);
  //     setCurrentDetailsModeHabit(null);
  //     setIsStreamControllerVisible(true)
  //     selfClearTimeout(() => {
  //       setIsOverlayInHideProcess(false)
  //       setIsDetailsModeActive(false);
  //     } , 450);
  //   }
  // };

  // const addToActiveBlockHandler = newActiveBlock => {
  //   setActiveBlockList(prev => [...prev , newActiveBlock]);
  // }


  // const setRoutinePropertiesHandler = ({ id , propName , value }) => {
  //   setStreamItem(prev => prev.map(el => el.id === id ? ({...el , [propName] : value}) : el));
  // }

  
  // useEffect(function scrollToActiveBlockHandler() {
  //   if(isToday && !loading) {
  //     if(!initialHelperScrollGetCompleted) {
  //       const currentHour = new Date().getHours();
  //       const mainParentContainerRef = parentNodeRef.current;
        
  //       if(activeBlockList.length) {
  //         if(activeBlockList.some(el => el.isInDoing)) {
  //           mainParentContainerRef.scrollTo({ top : activeBlockList.find(el => el.isInDoing).startPointPosition * 100 , behavior : "smooth" })
  //         }else {
  //           const sortedActiveList = deepClone(activeBlockList).sort((a , b) => a.startPointPosition - b.startPointPosition).sort((_ , b) => b.startPointPosition - currentHour);
  //           mainParentContainerRef.scrollTo({ top : sortedActiveList[0].startPointPosition * 100 , behavior : "smooth" })
  //         }
  //         setInitialHelperScrollGetCompleted(true)
  //       }else if(!loading && allChildrenGetRender){
  //         const currentTimelinePosition = ((currentHour > 0 ? currentHour - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666);
  //         selfClearTimeout(() => {
  //             mainParentContainerRef.scrollTo({ top : currentTimelinePosition ,  behavior : "smooth" });
  //             setInitialHelperScrollGetCompleted(true);
  //           } , 1500);
  //       }
  //     }
  //   }
  // } , [activeBlockList, parentNodeRef, loading, isToday, allChildrenGetRender, initialHelperScrollGetCompleted]);


  // return loading ? <div className="stream__loadingScreen" /> : (
  //   <div className="stream">
  //       { isToday && <Timeline shouldGetHide={currentDetailsModeHabit} /> }
  //       { isDetailsModeActive !== false && <StreamDetailsModeOverlayHelper isInDestroy={isOverlayInHideProcess} timelineDetails={timelineDetails} /> }
  //       { isDisable && <PreventOverlayDisableStream protectFrom={mainContainerRef.current} /> }
  //       <StreamOverlayHelper 
  //         visible={shouldOverlayGetVisible && !isInDragging}
  //         onClose={() => sideBarHandler()} />
  //       <DragDropContext onDragStart={dragStartHandler} onDragEnd={dragEndHandler} >
  //         <div ref={mainContainerRef} id="Container2" className={`todayHoursRow__container ${isInDragging || isResizeStart? "todayHoursRow__container--rowInHover": ""}`} >
  //           <div id="Container" style={{ position: "relative", zIndex: currentDetailsModeHabit ? 50000 : 5}}>
  //             {hours.map((el, i) => (
  //               <TodayHoursRow
  //                 indexInTimeline={!isOverlayInHideProcess && detailsTimeline.includes(el) && detailsTimeline.indexOf(el)}
  //                 isInTimeLine={!isOverlayInHideProcess && detailsTimeline.includes(el)}
  //                 index={el}
  //                 key={i} 
  //               />
  //             ))}
  //           </div>

  //           <Droppable droppableId={TODAY_ID}>
  //             {(provided , snapshot) => {
  //               return (
  //                   <div
  //                     ref={provided.innerRef}
  //                     {...provided.droppableProps}
  //                     className="stream__droppableContainer">
  //                       {streamItem.map((el, i) => {
  //                         if (!el.name) return <EmptyHabitBlock id={el.id} index={i} key={el.id} />
  //                         else if(el.type === "routine") 
  //                           return <RoutineStream 
  //                                     setIsInOtherVisionToParent={(...rest) => !isOverlayInHideProcess && detailsShowHandler(...rest)} 
  //                                     habitInStream={streamItem} 
  //                                     index={i} 
  //                                     key={i}
  //                                     setPropHandler={setRoutinePropertiesHandler}
  //                                     {...el} />
  //                         else return (
  //                             <StreamItem
  //                               isNextDayAfterToday={isNextDayAfterToday}
  //                               addToActiveBlockHandler={addToActiveBlockHandler}
  //                               leanDate={date}
  //                               deleteTimeoutRef={deleteTimeoutRef}
  //                               snapshot={snapshot}
  //                               setCurrentItemInDeleteProcess={setCurrentItemInDeleteProcess}
  //                               currentItemInDeleteProcess={currentItemInDeleteProcess}
  //                               isInDetailsMode={currentDetailsModeHabit === el.id ? true : false}
  //                               detailsShowHandler={detailsShowHandler}
  //                               sidebarClosedByUser={sidebarClosedByUser}
  //                               isInResizing={isResizeStart}
  //                               isInDragging={isInDragging}
  //                               setNthChildHandler={setIsResizeStart}
  //                               setIsSidebarOpen={setIsSidebarVisible}
  //                               resizeHandler={resizeHandler}
  //                               index={i}
  //                               hoursGoNext={el.hoursGoNext}
  //                               id={el.id}
  //                               color={el?.color}
  //                               habitName={el.name}
  //                               key={el.id}
  //                               habitInStream={streamItem}
  //                               setHabitInStream={setStreamItem}
  //                             />
  //                           );
  //                       })}
  //                       <AfterAllChildRenderSettled 
  //                         showControllerHandler={setIsStreamControllerVisible} 
  //                         setAllChildRender={setAllChildrenGetRender} />
  //                       {provided.placeholder}
  //                 </div>
  //               )
  //             }}
  //           </Droppable>
  //         </div>
  
  //       </DragDropContext>
  //   </div>
  // )

  useEffect(function streamInitializer() {
    setIsFirstRender(true);
    requests.stream.initializer(date , ({ streamItem , todayHabit }) => {
      setStreamItem(streamItem);
      setTodayHabit(todayHabit);
      setLoading(false)
    })
  } , [date]);

  const onStreamItemChange = newStreamList => {
    requests.stream.sync(date , deepClone(newStreamList));
  }

  return loading ? <div>Loading</div> : (
    <div className="stream">
      <div className="stream__hour">
        <StreamHour />
      </div>
      <div className="stream__items"> 
        <ReactGridLayout
          className="layout"
          layout={streamItem}
          cols={4}
          onResizeStop={onStreamItemChange}
          onDragStop={onStreamItemChange}
          rowHeight={100}
          resizeHandle={props => <TER {...props} />}
          verticalCompact={false}
          maxRows={24}
          preventCollision={true}
          width={window.innerWidth - 130}
          margin={[0 , 0]}>
          {
            streamItem.map((el) => <div key={el.i} style={{background : `#${getRandomItem(colors)}` , userSelect : "none" }}></div>)
          }
        </ReactGridLayout>
      </div>
      {/* <StreamSidebar
          leanedHabitInStream={streamItem.filter(el => el.name)}
          isInDragging={false}
          date={date}
          isInStreamDetailsMode={currentDetailsModeHabit}
          injectedTodo={injectedTodo}
          isSidebarOpen={isSidebarVisible}
          setInjectedTodo={setInjectedTodo}
          sideBarHandler={sideBarHandler}
          todayHabit={todayHabit} /> */}
    </div>
  )
};

export default Stream;