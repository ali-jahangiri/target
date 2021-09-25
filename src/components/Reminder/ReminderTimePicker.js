import { useEffect, useRef, useState } from "react";
import useKeyBaseState from "../../Hook/useKeyBaseState";

const hrValidateHandler = value => {
    if(value > 24) return 24
    else if(value <= 0) return 0
    else return value
}

const minValidateHandler = value => {
    if(value > 59) return 59;
    else if(value <= 0) return 0;
    else return value
}

const ReminderTimePicker = ({ onChange ,  }) => {
    const [currentFocusedInput, setCurrentFocusedInput] = useState("hours");
    const [time , setTime] = useKeyBaseState({ min : 0 , hr : 12 })

    const hourInputRef = useRef();
    const minuteInputRef = useRef();

    const focusOnHoursInputHandler = () => {
        if(!currentFocusedInput) {
            hourInputRef.current?.focus();
        }
    }

    useEffect(() => onChange(time) , [time]);
    
    return (
        <div className="reminderTimePicker">
            <div className="reminderTimePicker__title">
                <p onClick={focusOnHoursInputHandler}>Pick a Time</p>
            </div>
            <div className="reminderTimePicker__numberContainer">
                <div className="reminderTimePicker__hours">
                    <input
                        className={currentFocusedInput !== "hours"  && currentFocusedInput !== null ? "reminderTimePicker--fadeInput" : ""}
                        onBlur={() => setCurrentFocusedInput(null)} 
                        onFocus={() => setCurrentFocusedInput("hours")}
                        placeholder="12"
                        type="number"
                        onMouseEnter={() => hourInputRef.current?.focus()}
                        min={1}
                        ref={hourInputRef}
                        value={+time.hr < 10 ? `0${+time.hr}` : +time.hr}
                        onChange={({ target : { value } }) => setTime("hr", hrValidateHandler(+value))} />
                </div>
                <div>
                    <p>:</p>
                </div>
                <div className="reminderTimePicker__minute">
                    <input
                        className={currentFocusedInput !== "minute" && currentFocusedInput !== null ? "reminderTimePicker--fadeInput" : ""}
                        min={0}
                        type="number"
                        maxLength={2}
                        ref={minuteInputRef}
                        onMouseEnter={() => minuteInputRef.current?.focus()}
                        onBlur={() => setCurrentFocusedInput(null)} 
                        onFocus={() => setCurrentFocusedInput("minute")}
                        placeholder="00"
                        value={time.min < 10 ? `0${time.min}` : time.min}
                        onChange={({ target : { value } }) => setTime("min" , minValidateHandler(+value))} />
                </div>
                <div className={`reminderTimePicker__inputFrame reminderTimePicker__inputFrame--${currentFocusedInput}`}></div>
            </div>
        </div>
    )
}



export default ReminderTimePicker;