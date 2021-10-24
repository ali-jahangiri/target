import { calcAllHabitForDay, idGenerator, requests, selfClearTimeout } from "../../utils";

import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useEffect, useLayoutEffect, useState } from "react";
import RoutineCreator from "./RoutineCreator";
import RoutineBlock from "./RoutineBlock";
import useAfterInitialEffect from "./useAfterInitialEffect";


const WeekDay = ({ name , filedHabit , setCurrentDayName , currentDayName }) => {
    const mostRepeatedColor = filedHabit.sort((a, b) => b.schedule.length - a.schedule.length)[0]?.color;
    const [shouldControllerGetInitialHide, setShouldControllerGetInitialHide] = useState(false);
    const [isInNewRoutineCreationProcess, setIsInNewRoutineCreationProcess] = useState(false);
    const [isValidToCreateRoutine, setIsValidToCreateRoutine] = useState(false);
    
    const [routineList, setRoutineList] = useState([]);

    useLayoutEffect(() => {
        selfClearTimeout(() => {
            setShouldControllerGetInitialHide(true);
        } , 1300)
    } , [])

    useEffect(function getRoutineList() {
        requests.routine.getRoutineList(name , res => {
            setRoutineList(res?.list || [])
        })
    } , [name]);

    
    const cleanUpRoutineCreation = () => {
        setIsInNewRoutineCreationProcess(false);
        setIsInNewRoutineCreationProcess(false);
    }

    const createRoutineHandler = () => {
        if(routineList.length) {
            // you can add new routine to current existing routine day
            requests.routine.setNewRoutine(name , { ...isValidToCreateRoutine , id : idGenerator()})
                .then(cleanUpRoutineCreation)
        }else {
            // then you should initialize routine day document
            requests.routine.initializeRoutineName(name)
                .then(_ => {
                    requests.routine.setNewRoutine(name , { ...isValidToCreateRoutine , id : idGenerator()})
                        .then(cleanUpRoutineCreation)
            })
        }

    }


    const editRoutineHandler= newRoutineModel => {
        setRoutineList(prev => prev.map(el => el.id === newRoutineModel.id ? newRoutineModel : el))
    }

    useAfterInitialEffect(function syncRoutineHandler() {
        requests.routine.syncRoutine(name , routineList)
    } , [routineList])



    return (
        <div className={`weekDay ${isInNewRoutineCreationProcess ? "weekDay--newRoutineMode" : ""}`}>
            <div className="weekDay__detailsContainer">
                <div className="weekDay__habitListContainer">
                    <div className="weekDay__habitIntro">
                        <p>Settled Habit </p>
                    </div>
                    <div className="weekDay__habit">
                    {
                            filedHabit.map(target => target.schedule.map((el , i) => (
                                <div style={{ backgroundColor : `#${target.color}`}} className="weekDay__habitItem" key={i}>
                                    <p>{el.name}</p>
                                    <p>For <span>{target.targetName}</span></p>
                                </div>
                            )))
                        }
                    </div>
                </div>
                {
                    !!routineList.length && <div key={idGenerator()} className="weekDay__routineListContainer">
                        <div className="weekDay__routineIntro">
                            <p>Settled Routine</p>
                        </div>
                        <div className="weekDay__routineDirectory">
                            {
                                routineList.map((el , i) => (
                                    <RoutineBlock editRoutineHandler={editRoutineHandler} currentDayName={name} key={i} {...el} />
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
            <div onMouseEnter={() => setShouldControllerGetInitialHide(false)} style={{ backgroundColor : `#${mostRepeatedColor}` }} className="weekDay__nameContainer">
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
            <div className="weekDay__routine">
                    <div className="weekDay__routine__trigger">
                        <p className="weekDay__routine__starterTrigger" onClick={() => setIsInNewRoutineCreationProcess(true)}>Found a new <span>Routine</span> in the day ? </p>
                        <div style={{ display : "flex" , alignItems : "center" }}>
                            {
                                isInNewRoutineCreationProcess && <span className="weekDay__routine__backTrigger" onClick={() => setIsInNewRoutineCreationProcess(false)}>Back</span>
                            }
                            {
                                isValidToCreateRoutine && isInNewRoutineCreationProcess && <div className="weekDay__routine__createTrigger"> 
                                    <p onClick={createRoutineHandler}>Create Routine</p>
                                </div>
                            }
                        </div>
                    </div>
                    {
                        isInNewRoutineCreationProcess && <div className="weekDay__routine__form">
                            <RoutineCreator routineList={routineList} setIsValidToCreateRoutine={setIsValidToCreateRoutine} />
                        </div>
                    }
            </div>
        </div>
    )
}


export default WeekDay;