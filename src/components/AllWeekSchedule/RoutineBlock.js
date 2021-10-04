import { useState } from "react";
import useKeyBaseState from "../../Hook/useKeyBaseState";
import { colors, generateColor, hourValueChecker, requests } from "../../utils";
import Input from "../Input";




const RoutineBlock = ({ name , color , hour , id , currentDayName }) => {
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [draftRoutineValue , setDraftRoutineValue] = useKeyBaseState({ name , color , hour : { from : +hour.from , to : +hour.to } });

    const leaveHandler = () => {
        setIsInEditMode(false)
        setDraftRoutineValue({ name , color , hour })
    }

    const saveChangeHandler = () => {
        // requests.routine.editRoutine()
    }


    const timeHourChangeHandler = (destination , value) => {
        const { from , to } = draftRoutineValue.hour;

        setDraftRoutineValue('hour' , {
            ...draftRoutineValue.hour,
            [destination] : hourValueChecker(+value , destination , to + 1 , from)
        })
    }

    const pickerRandomColorHandler = () => {
        setDraftRoutineValue("color" , colors[Math.floor(Math.random() * colors.length)])
    }

    const haveSomeChange = (() => {
        if(draftRoutineValue.name !== name) return true;
        else if(draftRoutineValue.color !== color) return true;
        else if(draftRoutineValue.hour.from !== hour.from || draftRoutineValue.hour.to !== hour.to ) return true;
    })();

    
    return (
        <div style={{ backgroundColor : generateColor(`#${draftRoutineValue.color}` , 2) }} className="weekDay__routineItem">
            <div className="weekDay__routineItem__name">
                <Input
                    placeholder="Routine Name"
                    mode="dark" 
                    readOnly={!isInEditMode} 
                    value={draftRoutineValue.name} 
                    onChange={value => setDraftRoutineValue("name" , value)} />
            </div>
            <div className="weekDay__routineItem__hour">
                <div>From <Input 
                    type="number"
                    min={1}
                    length={2}
                    max={24}
                    onBlur={() => {
                        if(!Number(draftRoutineValue.hour.from)) {
                            timeHourChangeHandler("from" , 1) 
                        }
                    }}
                    value={Number(draftRoutineValue.hour.from)} 
                    onChange={value => timeHourChangeHandler('from' , value)} 
                    readOnly={!isInEditMode} /> To <Input
                        onChange={value => timeHourChangeHandler("to" , value)}
                        onBlur={() => {
                            if(!Number(draftRoutineValue.hour.to)) {
                                timeHourChangeHandler("to" , draftRoutineValue.hour.from + 1)
                            }
                        }}
                        type="number"
                        min={1} 
                        max={24} 
                        value={draftRoutineValue.hour.to} 
                        readOnly={!isInEditMode} /></div>
                <span onClick={setIsInEditMode} className={`weekDay__routineItem__circle ${isInEditMode ? "weekDay__routineItem__circle--active" : ""}`}>
                    <span style={{ backgroundColor : `#${draftRoutineValue.color}` }} />
                </span>
            </div>
            <div className={`weekDay__routineItem__controller ${isInEditMode ? "weekDay__routineItem__controller--show" : ""}`}>
                {
                    haveSomeChange && <div className={`weekDay__routineItem__controller__save`}>
                        <button onClick={saveChangeHandler}>Save</button>
                    </div>
                }
                <div className="weekDay__routineItem__controller__cancel">
                    <button onClick={leaveHandler}>{haveSomeChange ? "Cancel" : "Back"}</button>
                </div>
            </div>
            <div className={`weekDay__routineItem__colorPicker ${isInEditMode ? "weekDay__routineItem__colorPicker--show" : ""}`}>
                <p onClick={pickerRandomColorHandler}>Pick a color</p>
            </div>
        </div>
    )
}


export default RoutineBlock;