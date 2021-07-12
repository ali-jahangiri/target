import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  FiChevronLeft,
  FiMoreHorizontal,
  FiLock,
  FiCheck,
} from "react-icons/fi";

import { CgClose } from "react-icons/cg";

import db from "../firebase";
import {
  habitForTodayExtractor,
  idGenerator,
  selfClearTimeout,
} from "../utils";

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

const HabitInStreamItem = ({
  detailsShowHandler,
  id,
  sidebarClosedByUser,
  index,
  setIsSidebarOpen,
  color,
  habitName,
  resizeHandler,
  hoursGoNext,
  setNthChildHandler,
  isInDragging,
  isInResizing,
  isInDetailsMode,
  setHabitInStream,
  habitInStream,
}) => {
  const [internalH, setInternalH] = useState(0);
  const [isDetailsOptionMenuOpen, setIsDetailsOptionMenuOpen] = useState(false);

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

  return (
    <Draggable isDragDisabled={isInDetailsMode} draggableId={id} index={index}>
      {(provided) => (
        <Resizable
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
              <div
                className={`resizeTrigger ${
                  isInResizing === id ? "resizeTrigger--active" : ""
                }`}
              ></div>
            ),
          }}
        >
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
                    onClick={() =>
                      isInDetailsMode
                        ? setIsDetailsOptionMenuOpen((prev) => !prev)
                        : detailsShowHandler(id)
                    }
                    className={`today__habitInStreamItem__detailsTrigger ${
                      isInDetailsMode
                        ? "today__habitInStreamItem__detailsTrigger--rotate"
                        : ""
                    }`}
                  >
                    <FiMoreHorizontal />
                  </div>
                  <div
                    onClick={() => detailsShowHandler(id)}
                    className={`determiner ${
                      isInDetailsMode ? "determiner--active" : ""
                    }`}
                  >
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

const Today = () => {
  const [todayHabit, setTodayHabit] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [habitInStream, setHabitInStream] = useState(
    hours.map((_) => ({ name: null, id: idGenerator(), hoursGoNext: 1 }))
  );
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [currentHabitBlock, setCurrentHabitBlock] = useState(null);

  const [isResizeStart, setIsResizeStart] = useState(false);

  const [sidebarClosedByUser, setSidebarClosedByUser] = useState(false);

  const [isDetailsModeActive, setIsDetailsModeActive] = useState(false);
  const [detailsTimeline, setDetailsTimeline] = useState([]);
  const [timelineHeight, setTimelineHeight] = useState(0);
  const [currentDetailsModeHabit, setCurrentDetailsModeHabit] = useState(null);

  useEffect(() => {
    db.collection("target").onSnapshot((snapshot) => {
      setTodayHabit(
        habitForTodayExtractor(snapshot.docs.map((el) => ({ ...el.data() })))
      );
      setLoading(false);
    });
  }, []);

  const dragEndHandler = ({ source, destination, draggableId }) => {
    setIsDraggingStart(false);
    if (!isSidebarOpen && !sidebarClosedByUser)
      selfClearTimeout(() => setIsSidebarOpen(true), 500);

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
        habitClone.splice(insertIndex, 0, {
          ...todayHabit.find((el) => el.id === draggableId),
          id: idGenerator(),
          hoursGoNext: 1,
        });
        return habitClone;
      }
    });
  };

  const dragStartHandler = ({ source }) => {
    setIsDraggingStart(true);
    if (source.droppableId === TODAY_ID) setIsSidebarOpen(false);
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
    const wasUnderValidH =
      height <= 0 && habitInStream[index].hoursGoNext === 1 ? true : false;
    if (height && !wasUnderValidH) {
      let floatedHours = Math.round(
        height >= 100 ? height / 100 : height / 100
      );
      setHabitInStream((prev) =>
        prev.map((el, i) =>
          i === index
            ? { ...el, hoursGoNext: el.hoursGoNext + floatedHours }
            : el
        )
      );
    }
  };

  const sideBarHandler = () => {
    setSidebarClosedByUser(true);
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    console.log(detailsTimeline, "timeline");
  }, [detailsTimeline]);

  const detailsShowHandler = (id) => {
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

  return loading ? (
    <LoadingPage />
  ) : (
    <div className="today">
      {isDetailsModeActive && (
        <div style={{ top: isDetailsModeActive }} className="helperOverlay">
          <span
            style={{ height: timelineHeight }}
            className="helperOverlay__timeline"
          >
            <span></span>
          </span>
        </div>
      )}
      <DragDropContext
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
      >
        <div
          className={`todayHoursRow__container ${
            isDraggingStart || isResizeStart
              ? "todayHoursRow__container--rowInHover"
              : ""
          }`}
        >
          <div
            style={{
              position: "relative",
              zIndex: currentDetailsModeHabit ? 50000 : -1,
            }}
          >
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
        <div
          className={`today__habitSidebar today__habitSidebar--${
            isSidebarOpen ? "open" : "close"
          } ${currentDetailsModeHabit ? "today__habitSidebar--lock" : ""}`}
        >
          <div
            onClick={() => !currentDetailsModeHabit && sideBarHandler()}
            className={`today__habitSidebar__closeTrigger ${
              isSidebarOpen ? "today__habitSidebar__closeTrigger--flipped" : ""
            }`}
          >
            {currentDetailsModeHabit ? (
              <FiLock color="rgb(82, 82, 82)" />
            ) : (
              <FiChevronLeft color="rgb(82, 82, 82)" />
            )}
          </div>
          <div className="today__habitSidebar__habitDirectory">
            <Droppable isDropDisabled droppableId={HABIT_LIST_ID}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {todayHabit.map((el, i) => (
                    <Draggable key={i} draggableId={el.id} index={i}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="sliderHabitBlock__habitItem"
                        >
                          <div
                            onMouseDown={({ currentTarget, nativeEvent }) => {
                              if (!isDraggingStart) return;
                              let className = "sliderHabitBlock__habitItem";
                              setCurrentHabitBlock(currentTarget);
                              let x = nativeEvent.offsetX;
                              if (x >= 105 && x <= 205) return;
                              if (x > 105) {
                                currentTarget.classList.add(
                                  `${className}--leftRotate`
                                );
                                currentTarget.classList.remove(
                                  `${className}--rightRotate`
                                );
                              } else {
                                currentTarget.classList.add(
                                  `${className}--rightRotate`
                                );
                                currentTarget.classList.remove(
                                  `${className}--leftRotate`
                                );
                              }
                            }}
                            style={{
                              backgroundColor: `#${el.color || "dcdcdc"}`,
                            }}
                            className="sliderHabitBlock__habitItem__container"
                          >
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
