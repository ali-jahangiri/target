import { useState } from "react";
import useKeyBaseState from "../../Hook/useKeyBaseState";

const ReminderTimePicker = ({ onChange ,  }) => {
    const [currentFocusedInput, setCurrentFocusedInput] = useState("hours");
    const [] = useKeyBaseState({ min : 0 , hr : 12 })

    return (
        <div className="reminderTimePicker">
            <div className="reminderTimePicker__title">
                <p>Pick a Time</p>
            </div>
            <div className="reminderTimePicker__numberContainer">
                <div className="reminderTimePicker__hours">
                    <input 
                        onBlur={() => setCurrentFocusedInput(null)} 
                        onFocus={() => setCurrentFocusedInput("hours")}
                        placeholder="12" 
                        value={""} />
                </div>
                <div>
                    <p>:</p>
                </div>
                <div className="reminderTimePicker__minute">
                    <input
                        onBlur={() => setCurrentFocusedInput(null)} 
                        onFocus={() => setCurrentFocusedInput("minute")}
                        placeholder="00" 
                        value={""} />
                </div>
                <div className={`reminderTimePicker__inputFrame reminderTimePicker__inputFrame--${currentFocusedInput}`}>

                </div>
            </div>
        </div>
    )
}



export default ReminderTimePicker;