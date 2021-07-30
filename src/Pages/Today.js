import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FiChevronLeft, FiMoreHorizontal, FiLock, FiCheck } from "react-icons/fi";
import { CgClose } from "react-icons/cg";
import { Resizable } from "re-resizable";


import { idGenerator, selfClearTimeout } from "../utils";


import TodayHoursRow from "../components/TodayHoursRow";
import Alert from "../components/Alert";
import DetailsOptionsMenu from "../components/DetailsOptionMenu";
import Todo from "../components/Todo";
import { useDispatch, useSelector } from "../Store/Y-State";
import { setStream } from "../Store/slices/streamSlice";

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

const WritableDetails = ({
  value,
  onChange,
  placeholder = "write and save your idea about this habit...",
}) => {
  const inputRef = useRef();

  useEffect(() => {
    selfClearTimeout(() => {  
      inputRef.current?.focus();
    }, 3000);
  }, [inputRef]);

  return (
    <input
      placeholder={placeholder}
      ref={inputRef}
      value={value}
      onChange={({ target: { value } }) => onChange(value)}
      className="writableDetails"
    />
  );
};

const HabitInStreamItem = ({ detailsShowHandler, id, sidebarClosedByUser, index, setIsSidebarOpen, color, habitName, resizeHandler, hoursGoNext, setNthChildHandler, isInDragging, isInResizing, isInDetailsMode, setHabitInStream, habitInStream, }) => {
  const [internalH, setInternalH] = useState(0);
  const [isDetailsOptionMenuOpen, setIsDetailsOptionMenuOpen] = useState(false);
  const [needToFillGap, setNeedToFillGap] = useState(null);



  const inputDetailsChangeHandler = (key, value) => {
    setHabitInStream((prev) => {
      return prev.map((el, i) => (el.id === id ? { ...el, [key]: value } : el));
    });
  };

  const internalResizeHandler = (e, dir, ref, d) => {
    setInternalH(d.height);
    setIsSidebarOpen(false);
    setNthChildHandler(id);
  };

  const resizeEndHandler = () => {
    resizeHandler({ id, height: internalH, index });
    setNthChildHandler(false);
    !sidebarClosedByUser && setIsSidebarOpen(true);
  };

  let availableNextHours = 24 - (index + hoursGoNext);
  const _initialWasSettled = !!habitInStream.find((el) => el.id === id)
    ?._initial;

  const refContainer = useRef();

  const showDetailsHandler = (reset) => {
    if (reset === false) {
      setNeedToFillGap(0);
      detailsShowHandler();
      return;
    }

    if (isInDetailsMode) {
      setIsDetailsOptionMenuOpen((prev) => !prev);
    } else {
      detailsShowHandler(id);
      selfClearTimeout(() => {
        const currentTopGap =
          refContainer.current?.resizable?.getClientRects()[0].top;
        if (currentTopGap) {
          setNeedToFillGap(currentTopGap * -1);
        }
      }, 500);
    }
  };

  let ss = hoursGoNext * 100;

  return (
    <Draggable isDragDisabled={isInDetailsMode} draggableId={id} index={index}>
      {(provided) => (
        <Resizable
          style={{
            top: needToFillGap || 0,
            marginBottom: (needToFillGap && ss * -1) || 0,
          }}
          ref={refContainer}
          onResize={internalResizeHandler}
          onResizeStop={resizeEndHandler}
          className={`habitMainContainer ${
            isInDetailsMode ? "habitMainContainer--inDetailsMode" : ""
          }`}
          enable={{
            bottom:
              !isInDetailsMode && index + hoursGoNext !== 24 ? true : false,
          }}
          minHeight={100}
          maxHeight={
            !availableNextHours
              ? hoursGoNext * 100
              : availableNextHours * 100 + hoursGoNext * 100
          }
          grid={[100, 100]}
          defaultSize={{ width: "100%", height: hoursGoNext * 100 }}
          handleComponent={{
            bottom: (
              <div className={`resizeTrigger ${isInResizing === id ? "resizeTrigger--active" : ""}`}></div>),
          }}
        >
          {isDetailsOptionMenuOpen && (
            <DetailsOptionsMenu
              closeHandler={setIsDetailsOptionMenuOpen}
              bgColor={color}
            />
          )}
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`today__habitInStreamItem ${
              isInDragging ? "today__habitInStreamItem--hideResizeTrigger" : ""
            }`}
          >
            <div
              className="today__habitInStreamItem__container"
              style={{ backgroundColor: `#${color || "dcdcdc"}` }}
            >
              <div
                className={`innerContainer ${
                  isInDetailsMode ? "innerContainer--setUp" : ""
                }`}
              >
                <p>{habitName}</p>
                <div className="today__detailsModeCtaContainer">
                  <div
                    onClick={showDetailsHandler}
                    className={`today__habitInStreamItem__detailsTrigger ${
                      isInDetailsMode
                        ? "today__habitInStreamItem__detailsTrigger--rotate"
                        : ""
                    }`}
                  >
                    <FiMoreHorizontal />
                  </div>
                  <div onClick={() => showDetailsHandler(false)} className={`determiner ${isInDetailsMode ? "determiner--active" : ""}`} >
                    <div className={`${_initialWasSettled ? "visible" : ""}`}>
                      <FiCheck />
                    </div>
                    <div className={`${!_initialWasSettled ? "visible" : ""}`}>
                      <CgClose />
                    </div>
                  </div>
                </div>
              </div>
              {isInDetailsMode && (
                <div style={{ paddingTop: "4rem" }}>
                  <WritableDetails
                    value={habitInStream.find((el) => el.id === id)?._initial}
                    onChange={(value) =>
                      inputDetailsChangeHandler("_initial", value)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </Resizable>
      )}
    </Draggable>
  );
};

const Today = ({ date , sideBarEnabled }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const todayHabit = useSelector(state => Object.values(state.target).map(({ color , habit }) => ({ color , habit })));
  
  // console.log(todayHabit);

  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [currentHabitBlock, setCurrentHabitBlock] = useState(null);

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
    if(!firstTime) {
      storeDispatcher(setStream({ id : date , items : habitInStream }))
    }
  } , [habitInStream])


  const dragEndHandler = ({ source, destination, draggableId }) => {
    setIsDraggingStart(false);
    if (!isSidebarOpen && !sidebarClosedByUser) {
      selfClearTimeout(() => setIsSidebarOpen(true), 500);
    }

    if (currentHabitBlock) {
      ["leftRotate", "rightRotate"].map((el) =>
        currentHabitBlock.classList.remove(`sliderHabitBlock__habitItem--${el}`)
      );
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


  const detailsShowHandler = (id, h) => {
    const bodyStyle = document.body.style;

    if (!isDetailsModeActive) {
      setCurrentDetailsModeHabit(id);
      let currentItemHight =
        habitInStream.findIndex((el) => el.id === id) * 100;
      let start = currentItemHight / 100;
      let end = start + habitInStream.find((el) => el.id === id).hoursGoNext;

      const possibleStep = new Array(end - start).fill("").map((_) => ++start);

      window.scroll({
        top: currentItemHight,
        behavior: "smooth",
      });

      bodyStyle.overflow = "hidden";

      selfClearTimeout(() => {
        setDetailsTimeline(possibleStep);
        setIsDetailsModeActive((prev) => {
          return !prev
            ? window.pageYOffset !== undefined
              ? window.pageYOffset
              : (
                  document.documentElement ||
                  document.body.parentNode ||
                  document.body
                ).scrollTop
            : false;
        });
        setTimelineHeight(possibleStep.length * 100);
      }, 250);
    } else {
      setIsDetailsModeActive(false);
      setTimelineHeight(0);
      setDetailsTimeline([]);
      setCurrentDetailsModeHabit(null);
      bodyStyle.overflow = "auto";
    }
  };

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
      // window.removeEventListener("mousemove", (_) => {});
    };
  }, []);


  // console.log('render --------------------' , habitInStreamInsideStore);

  return (
    <div className="today">
      {isDetailsModeActive && (
        <div style={{ top: isDetailsModeActive }} className="helperOverlay">
          <span style={{ height: timelineHeight }} className="helperOverlay__timeline">
            <span></span>
          </span>
        </div>
      )}
      <DragDropContext
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
      >
        <div id="Container2" className={`todayHoursRow__container ${isDraggingStart || isResizeStart? "todayHoursRow__container--rowInHover": ""}`} >
          <div id="Container" style={{ position: "relative", zIndex: currentDetailsModeHabit ? 50000 : 5}}>
            {hours.map((el, i) => (
              <TodayHoursRow
                indexInTimeline={
                  detailsTimeline.includes(el) && detailsTimeline.indexOf(el)
                }
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
                className="today__droppableContainer"
              >
                {habitInStream.map((el, i) => {
                  if (!el.name)
                    return (
                      <NonValidHabitFiller id={el.id} index={i} key={el.id} />
                    );
                  else
                    return (
                      <HabitInStreamItem
                        isInDetailsMode={
                          currentDetailsModeHabit === el.id ? true : false
                        }
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
          <div className={`today__habitSidebar today__habitSidebar--${
            isSidebarOpen ? "open" : "close"
          } ${currentDetailsModeHabit ? "today__habitSidebar--lock" : ""}`}
        >
          <div
            onClick={() => !currentDetailsModeHabit && sideBarHandler()}
            className={`today__habitSidebar__closeTrigger ${
              isSidebarOpen ? "today__habitSidebar__closeTrigger--flipped" : ""
            }`}
          >
            {currentDetailsModeHabit ? <FiLock color="rgb(82, 82, 82)" /> : <FiChevronLeft color="rgb(82, 82, 82)" />}
          </div>
          <div className="today__habitSidebar__habitDirectory">
            <Droppable isDropDisabled droppableId={HABIT_LIST_ID}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {todayHabit.map((el, i) => (
                    el.habit.map((habit , index) => (
                      <Draggable key={index} draggableId={habit.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="sliderHabitBlock__habitItem"
                        >
                          <div onMouseDown={({ currentTarget, nativeEvent }) => {
                              // if (!isDraggingStart) return;
                              // let className = "sliderHabitBlock__habitItem";
                              // setCurrentHabitBlock(currentTarget);
                              // let x = nativeEvent.offsetX;
                              // if (x >= 105 && x <= 205) return;
                              // if (x > 105) {
                              //   currentTarget.classList.add(`${className}--leftRotate`);
                              //   currentTarget.classList.remove(`${className}--rightRotate`);
                              // } else {
                              //   currentTarget.classList.add(`${className}--rightRotate`);
                              //   currentTarget.classList.remove(`${className}--leftRotate`);
                              // }
                            }}
                            style={{backgroundColor: `#${el.color || "dcdcdc"}`}}
                            className="sliderHabitBlock__habitItem__container"
                          >
                            <p>{habit.name}</p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                    ))
                  ))}
                  <Todo
                    value={injectedTodo} 
                    changeHandler={setInjectedTodo} 
                    index={todayHabit.length} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div> : null
        }
      </DragDropContext>
    </div>
  );
};

export default Today;
