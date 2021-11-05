import { useState , useEffect, useRef} from "react";
import ReactGridLayout from "react-grid-layout";
import { deepClone, requests, selfClearTimeout } from "../../utils";
import StreamHour from "./StreamHour";
import StreamSidebar from "./StreamSidebar";
import StreamItem from "./StreamItem";
import Timeline from "../Timeline";
import StreamOverlayHelper from "./StreamOverlayHelper";
import RoutineStream from "./RoutineStream";

const DynamicStreamItem = ({ 
    type , 
    details , 
    isToday , 
    isInDragging ,
    layout,
    isLastStream,
    addToActiveBlockHandler,
    setAllChildrenGetRender
}) => {
  useEffect(() => {
    if(isLastStream) setAllChildrenGetRender(true)
  } , [isLastStream])

  return <div className="stream__wrapper">
    {{
      routine : <RoutineStream {...details} />,
      habit : <StreamItem addToActiveBlockHandler={addToActiveBlockHandler} isToday={isToday} layout={layout} isInDragging={isInDragging} {...details} />,
      todo  : <StreamItem addToActiveBlockHandler={addToActiveBlockHandler} isToday={isToday} layout={layout} isInDragging={isInDragging} {...details} />,
    }[type]}
  </div>
}

const Stream = ({ 
  date ,
  setIsStreamControllerVisible ,
  isDisable ,
  isNextDayAfterToday,
  isToday,
}) => {
  const [loading, setLoading] = useState(true);
  const [streamItem, setStreamItem] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [todayHabit, setTodayHabit] = useState([]);
  const [shouldOverlayGetVisible, setShouldOverlayGetVisible] = useState(false);
  const [currentDetailsModeHabit, setCurrentDetailsModeHabit] = useState(null);
  const [isInDragging, setIsInDragging] = useState(false);
  const [isOneStreamItemInDragging, setIsOneStreamItemInDragging] = useState(false);
  const [injectedTodo, setInjectedTodo] = useState("")
  const [activeBlockList, setActiveBlockList] = useState([]);
  const [allChildrenGetRender, setAllChildrenGetRender] = useState(false);
  const [initialHelperScrollGetCompleted, setInitialHelperScrollGetCompleted] = useState(false);

  const userWasScrollByHimSelfInInitial = useRef(false);

  // const [currentItemInDeleteProcess, setCurrentItemInDeleteProcess] = useState(false);
  // const [isResizeStart, setIsResizeStart] = useState(false);
  // const [isDetailsModeActive, setIsDetailsModeActive] = useState(false);
  // const [detailsTimeline, setDetailsTimeline] = useState([]);
  // const [timelineDetails , setTimelineDetails] = useState({})
  // const [isOverlayInHideProcess, setIsOverlayInHideProcess] = useState(false);

    
  // const mainContainerRef = useRef();
  // const deleteTimeoutRef = useRef();

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

  
  const setRoutinePropertiesHandler = ({ id , propName , value }) => {
    setStreamItem(prev => prev.map(el => el.id === id ? ({...el , [propName] : value}) : el));
  }



  // return loading ? <div className="stream__loadingScreen" /> : (
  //   <div className="stream">
  //       { isDetailsModeActive !== false && <StreamDetailsModeOverlayHelper isInDestroy={isOverlayInHideProcess} timelineDetails={timelineDetails} /> }
  //       { isDisable && <PreventOverlayDisableStream protectFrom={mainContainerRef.current} /> }
  //       
  //       
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

  const sideBarHandler = () => {
    setIsSidebarVisible(prev => {
      if(!prev) {
        setShouldOverlayGetVisible(true)
        setIsStreamControllerVisible(false);
      }
      else if(shouldOverlayGetVisible) {
        setShouldOverlayGetVisible(false);
        setIsStreamControllerVisible(true);
      };
      return !prev
    });
  };
  
  useEffect(function streamInitializer() {
    requests.stream.initializer(date , ({ streamItem , todayHabit }) => {
      setStreamItem(streamItem);
      setTodayHabit(todayHabit);
      setLoading(false)
    })
  } , [date]);

  const onStreamItemChange = (newStreamList) => {
    setIsOneStreamItemInDragging(null);
    const deepCloned = deepClone(streamItem.map(el => ({ details : el.details , layout : newStreamList.find(item => item.i === el.details.i) })));
    requests.stream.sync(date , deepCloned);
  }

  const onDrop = (_, layout , e) => {
    const details = JSON.parse(e.dataTransfer.getData("details"));
    setStreamItem(prev => {
      const endResult = [...deepClone(prev) , { details , layout : {...layout , i : details.i} }];
      requests.stream.sync(date , deepClone(endResult));
      return endResult;
    });
    setIsInDragging(false);
    setShouldOverlayGetVisible(false);
    setIsStreamControllerVisible(true);
  }

  const addToActiveBlockHandler = newActiveBlock => {
    setActiveBlockList(prev => [...prev , newActiveBlock]);
  }

  const draggingHandler = () => {
    setIsInDragging(true);
    setIsSidebarVisible(false)
  }

  const userScrollHandler = () => {
    if(!userWasScrollByHimSelfInInitial.current && !initialHelperScrollGetCompleted) {
      userWasScrollByHimSelfInInitial.current = true;
    }
  }

  
  useEffect(function setControllerVisibility() {
    if(!loading) setIsStreamControllerVisible(true);
  } , [loading])

  useEffect(function scrollToActiveBlockHandler() {
    if(isToday && !loading) {
      if(!initialHelperScrollGetCompleted) {
        const currentHour = new Date().getHours();
        
        if(activeBlockList.length) {
          const currentlyInProgressBlock = activeBlockList.find(el => el.isInDoing);
          // if we have some block witch currently is open and we should focus on that , we scroll to that item
          if(currentDetailsModeHabit) {
            window.scrollTo({ top : currentlyInProgressBlock.startPointPosition * 100 , behavior : "smooth" })
          }else {
            // else if we don't have active stream block , then we should scroll to nearest item current hour for get ready to start item
            const sortedActiveList = deepClone(activeBlockList).sort((a , b) => a.startPointPosition - b.startPointPosition).sort((_ , b) => b.startPointPosition - currentHour);
            window.scrollTo({ top : sortedActiveList[0].startPointPosition * 100 , behavior : "smooth" })
          }
          setInitialHelperScrollGetCompleted(true)
        }else if(!loading && allChildrenGetRender){
          selfClearTimeout(() => {
            if(!userWasScrollByHimSelfInInitial.current) {
              const currentTimelinePosition = ((currentHour > 0 ? currentHour - 1 : 0) * 100 ) + (new Date().getMinutes() * 1.66666);
              window.scrollTo({ top : currentTimelinePosition ,  behavior : "smooth" });
            }
            setInitialHelperScrollGetCompleted(true);
          } , 3500);
        }
      }
    }
  } , [activeBlockList, loading, isToday, allChildrenGetRender, initialHelperScrollGetCompleted]);

  useEffect(() => {
    if(streamItem?.length && isToday) {
      const allInvolvedRow = streamItem.map(el => el.layout.y);
        if(streamItem.some(el => el.layout.x !== 0 && allInvolvedRow.filter(item => item === el.layout.y).length === 1)) {
          const result = deepClone(streamItem).map(item => {
            const haveOnlyInOneRow = allInvolvedRow.filter(el => el === item.layout.y).length === 1;
            if(haveOnlyInOneRow) return ({details : item.details , layout : {...item.layout , x : 0}})
              else return item
          })
          requests.stream.sync(date , result)
        }else {
            // const endResult = streamItem.map(el => {
            //   const currentEventRow = streamItem.find(item => item.layout.y === el.layout.y).layout.y;
            //   const allBlockInThisRow = streamItem.filter(item => item.layout.y === currentEventRow)
            //   if(allBlockInThisRow.length >= 2 && allBlockInThisRow.length < 4) {
            //     const sortedRowItem = deepClone(allBlockInThisRow).sort((a , b) => a.layout.x - b.layout.x);
            //     return {
            //       details : el.details,
            //       layout : {
            //         ...el.layout,
            //         x : sortedRowItem.findIndex(item => item.details.i === el.details.i)
            //       }
            //     }
            //   }else return el;
            // });
            // requests.stream.sync(date , endResult)
        }
      }
  } , [streamItem , isToday])



  return loading ? <div className="stream__loadingScreen" /> : (
    <div onWheel={userScrollHandler} className="stream">
      { isToday && <Timeline shouldGetHide={currentDetailsModeHabit} /> }
      <StreamOverlayHelper
          visible={shouldOverlayGetVisible && !isInDragging}
          onClose={sideBarHandler} />
      <div className="stream__hour">
        <StreamHour />
      </div>
      <div className="stream__items"> 
        <ReactGridLayout
          className="layout"
          layout={streamItem?.map(el => el.layout)}
          onResizeStop={onStreamItemChange}
          onDragStop={onStreamItemChange}
          onDrag={(_ , targetItem) => !isOneStreamItemInDragging && setIsOneStreamItemInDragging(targetItem.i)}
          onDrop={onDrop}
          cols={4}
          rowHeight={100}
          maxRows={24}
          compactType={"horizontal"}
          useCSSTransforms
          preventCollision={false}
          isDroppable
          isBounded
          width={(85 / 100) * window.innerWidth}
          margin={[0 , 0]}
        >
          {
            streamItem.map(({ details , layout } , index) => (
              <div 
                className="streamItem" 
                key={details.i} 
                style={{background : `#${details.color}`}}>
                  <DynamicStreamItem
                    setAllChildrenGetRender={setAllChildrenGetRender}
                    addToActiveBlockHandler={addToActiveBlockHandler}
                    isLastStream={(streamItem.length - 1) === index}
                    layout={layout}
                    isInDragging={details.i === isOneStreamItemInDragging}
                    type={details.type}
                    isToday={isToday}
                    details={details} />
              </div>
            ))
          }
        </ReactGridLayout>
      </div>
      <StreamSidebar
          leanedHabitInStream={streamItem.filter(el => el.name)}
          isInDragging={isInDragging}
          setIsInDragging={draggingHandler}
          date={date}
          isInStreamDetailsMode={currentDetailsModeHabit}
          injectedTodo={injectedTodo}
          isSidebarOpen={isSidebarVisible}
          setInjectedTodo={setInjectedTodo}
          sideBarHandler={sideBarHandler}
          todayHabit={todayHabit} />
    </div>
  )
};

export default Stream;