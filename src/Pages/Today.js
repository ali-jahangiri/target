import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FiChevronLeft , FiMoreHorizontal } from "react-icons/fi";

import db from "../firebase";
import {  habitForTodayExtractor, idGenerator, selfClearTimeout } from "../utils";

import { Resizable } from "re-resizable";

import TodayHoursRow from "../components/TodayHoursRow";
import { LoadingPage } from "../Pages";
import Alert from "../components/Alert";

// Static variables
const hours = new Array(24).fill().map((_, i) => i + 1);

const TODAY_ID = "todayHabit";
const HABIT_LIST_ID = "fromHabitList";



const NonValidHabitFiller = ({ index, id }) => {
  return (
    <Draggable draggableId={id} isDragDisabled index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="today__nonValidHabit"
        ></div>
      )}
    </Draggable>
  );
};

const HabitInStreamItem = ({ detailsShowHandler , id, sidebarClosedByUser ,index, setIsSidebarOpen , color, habitName, resizeHandler, hoursGoNext, setNthChildHandler, isInDragging, isInResizing, }) => {
  const [internalH, setInternalH] = useState(0);

  const internalResizeHandler = (e, dir, ref, d) => {
    setInternalH(d.height);
    setIsSidebarOpen(false);
    setNthChildHandler(id);
  }


  const resizeEndHandler = () => {
    resizeHandler({ id, height: internalH, index });
    setNthChildHandler(false);
    !sidebarClosedByUser && setIsSidebarOpen(true);
  }


  let availableNextHours = 24 - ( index + hoursGoNext )

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Resizable
          onResize={internalResizeHandler}
          onResizeStop={resizeEndHandler}
          className="habitMainContainer"
          enable={{ bottom: index + hoursGoNext !== 24 ? true : false  }}
          minHeight={100}
          maxHeight={!availableNextHours ? hoursGoNext * 100 : (availableNextHours * 100) + (hoursGoNext * 100)}
          grid={[100, 100]}
          defaultSize={{ width: "100%", height: hoursGoNext * 100}}
          handleComponent={{
            bottom: (<div className={`resizeTrigger ${isInResizing === id ? "resizeTrigger--active" : ""}`}></div>),
          }}>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`today__habitInStreamItem ${
              isInDragging ? "today__habitInStreamItem--hideResizeTrigger" : "" }`}
          >
            <div className="today__habitInStreamItem__container" style={{ backgroundColor: `#${color || "dcdcdc"}` }}>
              <p>{habitName}</p>
              <div onClick={() => detailsShowHandler(id)} className="today__habitInStreamItem__detailsTrigger">
                <FiMoreHorizontal />
              </div>
            </div>
          </div>
        </Resizable>
      )}
    </Draggable>
  );
};

const Today = () => {
  const [todayHabit, setTodayHabit] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [habitInStream, setHabitInStream] = useState(hours.map((_) => ({ name: null, id: idGenerator(), hoursGoNext: 1 })));
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [currentHabitBlock, setCurrentHabitBlock] = useState(null);

  const [isResizeStart, setIsResizeStart] = useState(false);

  const [sidebarClosedByUser, setSidebarClosedByUser] = useState(false);


  const [isDetailsModeActive, setIsDetailsModeActive] = useState(false);


  const [detailsTimeline, setDetailsTimeline] = useState([]);

  useEffect(() => {
    db.collection("target").onSnapshot((snapshot) => {
      setTodayHabit(habitForTodayExtractor(snapshot.docs.map((el) => ({ ...el.data() }))));
      setLoading(false);
    });
  }, []);




  const dragEndHandler = ({ source, destination, draggableId }) => {
    setIsDraggingStart(false);
    if(!isSidebarOpen && !sidebarClosedByUser) selfClearTimeout(() => setIsSidebarOpen(true) , 500);
    
    if (currentHabitBlock) {
      ["leftRotate", "rightRotate"].map((el) =>
        currentHabitBlock.classList.remove(`sliderHabitBlock__habitItem--${el}`)
      );
    }

    if (!destination || destination.index > 23) {
      Alert.warning("you cannot put your outside of today hours")
      return;
    };

    if (source.droppableId === TODAY_ID)
      return reorderHandler(destination, source);

    let insertIndex = destination.index;
    setHabitInStream((prev) => {
      const clone = [...prev];
      if (!clone[insertIndex].name) {
        clone[insertIndex] = {
          ...todayHabit.find((el) => el.id === draggableId),
          id: idGenerator(),
          hoursGoNext: 1,
        };
        return clone;
      } else {
        const habitClone = [...habitInStream];
        let targetWasInvalid;
        habitClone.splice(insertIndex , 0 , {...todayHabit.find((el) => el.id === draggableId) , id: idGenerator(), hoursGoNext: 1 })
        return habitClone
      }
    });
  };


  const dragStartHandler = ({ source }) => {
    setIsDraggingStart(true);
    if(source.droppableId === TODAY_ID) setIsSidebarOpen(false);
  }


  const reorderHandler = (destination, other) => {
    const habitClone = [...habitInStream];
    const [removed] = habitClone.splice(other.index, 1);
    habitClone.splice(destination.index, 0, removed);
    setHabitInStream(habitClone);
  };

  const resizeHandler = ({ height, index }) => {
    if(habitInStream[index].hoursGoNext+index === 24) {
      Alert.warning("your habit cannot ross over today hours")
      return;
    }
    const wasUnderValidH = height <= 0 && habitInStream[index].hoursGoNext === 1 ? true : false;
    if (height && !wasUnderValidH) {
      let floatedHours = Math.round(height >= 100 ? height / 100 : height / 100);
      setHabitInStream((prev) => prev.map((el, i) => i === index ? { ...el, hoursGoNext: el.hoursGoNext + floatedHours } : el ));
    }
  };


  const sideBarHandler = ()  => {
    setSidebarClosedByUser(true);
    setIsSidebarOpen((prev) => !prev)
  }

  useEffect(() => {
      console.log(detailsTimeline , "timeline");
  } , [detailsTimeline]);

  const detailsShowHandler = id => {
    let currentItemHight = habitInStream.findIndex(el => el.id === id) * 100;

    let start = (currentItemHight / 100 ) + 1;
    let end = start + habitInStream.find(el => el.id === id).hoursGoNext
    let remain = end - start + 1
    let current = start
    const res = new Array(end - start).fill("").map(el => current + 1);
    console.log('====================================');
    console.log(res);
    console.log('====================================');


    setDetailsTimeline([ start , end ])


    window.scroll({
      top:  currentItemHight,
      behavior: "smooth"
    })
    selfClearTimeout(() => {
      let bodyStyle = document.body.style;
      if(bodyStyle.overflow === "hidden") bodyStyle.overflow = "auto"
      else bodyStyle.overflow = "hidden";
      
      setIsDetailsModeActive(prev => {
        return !prev ? window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop : false
      })
    } , 1000)
  }




  // useEffect(() => {
  //   console.log("STREAM", habitInStream);
  // }, [habitInStream]);


  const currentYPage = useRef(window.pageYOffset);


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



  useLayoutEffect(() => {
    let timer = setInterval(() => {
      if (currentYPage.current <= 2400) {
        currentYPage.current += 100;
        window.scroll({
          top: currentYPage.current,
          behavior: "smooth",
        });
      } else {
        clearTimeout(timer);
      }
    }, 3.6e6);

    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove" , _ => {})
    };
  }, []);


  return loading ? <LoadingPage /> : (
    <div className="today">
      {
        isDetailsModeActive && <div style={{ top :  isDetailsModeActive}} className="layout__"></div>
      }
      <DragDropContext
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
      >
        <div className={`todayHoursRow__container ${isDraggingStart || isResizeStart? "todayHoursRow__container--rowInHover": "" }`}>
          <div>
            {hours.map((el, i) => (
              <TodayHoursRow isInTimeLine={detailsTimeline.includes(el)} index={el} key={i} />
            ))}
          </div>
          
          <Droppable droppableId={TODAY_ID}>
            {provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="today__droppableContainer">
                {habitInStream.map((el, i) => {
                  if (!el.name)
                    return <NonValidHabitFiller id={el.id} index={i} key={el.id} />;
                  else
                    return (
                      <HabitInStreamItem
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
                      />
                    );
                })}
                {provided.placeholder}
            </div>
            )}
          </Droppable>
        </div>
        <div className={`today__habitSidebar today__habitSidebar--${isSidebarOpen ? "open" : "close"}`}>
          <div onClick={sideBarHandler} className={`today__habitSidebar__closeTrigger ${isSidebarOpen ? "today__habitSidebar__closeTrigger--flipped" : ""}`}>
            <FiChevronLeft color="rgb(82, 82, 82)" />
          </div>
          <div className="today__habitSidebar__habitDirectory">
            <Droppable isDropDisabled droppableId={HABIT_LIST_ID}>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {todayHabit.map((el, i) => (
                    <Draggable key={i} draggableId={el.id} index={i}>
                      {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="sliderHabitBlock__habitItem">
                          <div
                            onMouseDown={({ currentTarget, nativeEvent }) => {
                              if(!isDraggingStart) return;
                              let className = "sliderHabitBlock__habitItem";
                              setCurrentHabitBlock(currentTarget);
                              let x = nativeEvent.offsetX;
                              if ((x >= 105 && x <= 205)) return;
                              if (x > 105) {
                                currentTarget.classList.add(`${className}--leftRotate`);
                                currentTarget.classList.remove(`${className}--rightRotate`);
                              } else {
                                currentTarget.classList.add(`${className}--rightRotate`);
                                currentTarget.classList.remove(`${className}--leftRotate`);
                              }
                            }}
                            style={{
                              backgroundColor: `#${el.color || "dcdcdc"}`,
                            }}
                            className="sliderHabitBlock__habitItem__container">
                            <p>{el.name}</p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Today;
