import { calcAllHabitForDay, selfClearTimeout } from "../../utils";

import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useLayoutEffect, useState } from "react";


const WeekDay = ({ name , filedHabit , setCurrentDayName , currentDayName }) => {
    console.log(filedHabit , name);
    const mostRepeatedColor = filedHabit.sort((a, b) => b.schedule.length - a.schedule.length)[0].color;
    const [shouldControllerGetInitialHide, setShouldControllerGetInitialHide] = useState(false);

    const [isInNewRoutineCreationProcess, setIsInNewRoutineCreationProcess] = useState(false);

    useLayoutEffect(() => {
        selfClearTimeout(() => {
            setShouldControllerGetInitialHide(true);
        } , 1300)
    } , [])

    console.log(currentDayName , "*");
    return (
        <div className={`weekDay ${isInNewRoutineCreationProcess ? "weekDay--newRoutineMode" : ""}`}>
            <div className="weekDay__detailsContainer">
                <div className="weekDay__habitIntro">
                    <p>Settled Habit </p>
                </div>
                <div className="weekDay__habit">
                {
                        filedHabit.map(target => target.schedule.map((el , i) => (
                            <div style={{ backgroundColor : `#${target.color}`}} className="weekDay__habitItem" key={i}>
                                <p>{el.name}</p>
                            </div>
                        )))
                    }
                </div>
            </div>
            <div style={{ backgroundColor : `#${mostRepeatedColor}` }} className="weekDay__nameContainer">
                <div className="weekDay__nameContainer__innerContainer">
                    <div className="weekDay__dayLabel"><p>{name}</p></div>
                    <div className="weekDay__sum">
                         <p>{calcAllHabitForDay(filedHabit)} habit from {filedHabit.length} target</p>
                     </div>
                    <div className={`weekDay__controller ${shouldControllerGetInitialHide ? "weekDay__controller--hide" : ""}`}>
                        <button disabled={currentDayName === 1} onClick={() => setCurrentDayName(prev => prev - 1)} >
                            <FiArrowLeft />
                        </button>
                        <button onClick={() => setCurrentDayName(prev => currentDayName === 7 ? 1 : prev + 1)}>
                            {
                                currentDayName === 7 ? <div className="weekDay__controller__returnTrigger">
                                    <p>Return Back</p>
                                </div> : <FiArrowRight />
                            }
                        </button>
                    </div>
                </div>
            </div>
            <div className="weekDay__routineTrigger">
                    <p onClick={() => setIsInNewRoutineCreationProcess(true)}>Find a new <span>Routine</span> in the day ? </p>
                    {
                        isInNewRoutineCreationProcess && <span className="weekDay__routineTrigger__backTrigger" onClick={() => setIsInNewRoutineCreationProcess(false)}>Back</span>
                    }
            </div>
        </div>
    )
}


export default WeekDay;