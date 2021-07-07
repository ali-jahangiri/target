import { useState } from "react";
import Container from "../components/Container";
import { idGenerator } from "../utils";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import HabitScheduleBlock from "../components/HabitScheduleBlock";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Redirect } from "react-router";

import db from "../firebase";

const namesOfDaysOfWeek = [
  {
    name: "جمعه",
    id: idGenerator(),
  },
  {
    name: "پنجشنبه",
    id: idGenerator(),
  },
  {
    name: "چهارشنبه",
    id: idGenerator(),
  },
  {
    name: "سه شنبه",
    id: idGenerator(),
  },
  {
    name: "دوشنبه",
    id: idGenerator(),
  },
  {
    name: "یکشنبه",
    id: idGenerator(),
  },
  {
    name: "شنبه",
    id: idGenerator(),
  },
];

const HabitPerDay = ({ location }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [schedule, setSchedule] = useState(() => {
    return namesOfDaysOfWeek.map((el) => ({
      day: el.name,
      habit: [],
    }));
  });
  const [currentHabitBlock, setCurrentHabitBlock] = useState(null);

  if (!location.state) return <Redirect to="/" />;

  const { targetName, habit, color } = location.state.target;

  const dragEndHandler = ({ destination, ...other }) => {
    setCurrentHabitBlock(null);
    if (!destination) return;
    // TODO handle already have habit

    console.log(destination, other);
    if (
      namesOfDaysOfWeek
        .map((el) => el.name)
        .includes(destination.droppableId) &&
      other.source.droppableId !== "habitItems"
    ) {
      return habitOrderHandler(destination, other);
    } else if (destination && destination.droppableId !== "habitItems") {
      setSchedule((prev) =>
        [...prev].map((el) =>
          el.day === destination.droppableId
            ? {
                day: el.day,
                habit: (() => {
                  let currentHabit = [...el.habit];
                  currentHabit.splice(destination.index, 0, {
                    name: other.draggableId,
                    id: idGenerator(),
                  });
                  return currentHabit;
                })(),
              }
            : el
        )
      );
    }
  };

  const habitOrderHandler = (destination, other) => {
    const result = Array.from(schedule).find(
      (el) => el.day === destination.droppableId
    );
    const [removed] = result.habit.splice(other.source.index, 1);
    result.habit.splice(destination.index, 0, removed);
    setSchedule((prev) =>
      prev.map((el) => (el.day === destination.droppableId ? result : el))
    );
  };

  const dragStartHandler = (e) => {
    if (e.source.droppableId === "habitItems") {
      setCurrentHabitBlock(e.draggableId);
    }
  };

  const doneHandler = () => {
    db.collection("target")
      .add({ schedule })
      .then((data) => {});
  };

  return (
    <div className="habitPerDay">
      <Container>
        <div className="habitPerDay__header">
          <div>
            <p>Schedule for achieve</p>
            <p>{targetName}</p>
          </div>
          <div>
            <p onClick={doneHandler} className="habitPerDay__done">
              Done With it
            </p>
          </div>
        </div>
        <DragDropContext
          onDragStart={dragStartHandler}
          onDragEnd={dragEndHandler}
        >
          <div className="habitPerDay__schedulePlayground">
            <div className="habitPerDay__weekDay">
              {namesOfDaysOfWeek.map((el, i) => (
                <Droppable key={i} droppableId={el.name}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      key={i}
                      className={`habitPerDay__weekDay__item ${
                        currentHabitBlock
                          ? "habitPerDay__weekDay__item--hoverWithHabitInGrab"
                          : ""
                      }`}
                    >
                      <div className="habitPerDay__weekDay__item__innerContainer">
                        <p>{el.name}</p>
                      </div>
                      <>
                        {(() => {
                          return schedule
                            .find((day) => day.day === el.name)
                            .habit?.map((el, i) => (
                              <Draggable
                                key={el.id}
                                draggableId={(() => el.id)()}
                                index={i}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    key={i}
                                    className="habitPerDay__weekDay__addedHabit"
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                  >
                                    {el.name}
                                  </div>
                                )}
                              </Draggable>
                            ));
                        })()}
                        {provided.placeholder}
                      </>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
            <div
              className={`habitPerDay__habitSidebar ${
                !isSidebarOpen ? "habitPerDay__habitSidebar--active" : ""
              }`}
            >
              <div
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="habitPerDay__habitSidebar__trigger"
              >
                {!isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
              </div>
              <div className="ss">
                <Droppable droppableId="habitItems">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {habit.map((el, i) => (
                        <HabitScheduleBlock
                          picked={currentHabitBlock}
                          index={i}
                          draggableId={el.name}
                          key={i}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        </DragDropContext>
      </Container>
    </div>
  );
};

export default HabitPerDay;
