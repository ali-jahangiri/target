import useKeyBaseState from "../../Hook/useKeyBaseState";
import Input from "../Input";
import ReminderDesc from "./ReminderDesc";
import ReminderTimePicker from "./ReminderTimePicker";

import requests from "../../utils/requests";
import { useState } from "react";
import { selfClearTimeout } from "../../utils";

const ReminderPlayground = ({ leanDate }) => {
    const [data , setData] = useKeyBaseState({ title : "" ,  });
    const [wasReminderSet, setWasReminderSet] = useState(false);


    const titleInputChange = value => {
        setData("title" , value);
    }


    const createReminderHandler = () => {
        requests.commends.reminder.setReminder(leanDate , data)
            .then(() => {
                setWasReminderSet(true);
                setData({});
                selfClearTimeout(() => {
                    setWasReminderSet(false)
                } , 2500)
            })
    }

    const reminderDisableChecker = () => {
        const { title , time ,desc } = data;
        if(title && time && desc) {
            return false
        }else return true;
    }
    
    return (
        <div className="reminderPlayground">
            {
                wasReminderSet && <div>Alert : reminder set</div>
            }
            <Input
                labelStyle={{ fontSize : "1.2rem" }}
                style={{ fontSize : "2rem" }}
                mode="dark"
                showLabel
                value={data?.title}
                placeholder="Reminder Title"
                onChange={titleInputChange}
                />
            <ReminderTimePicker
                value={data.time || { min : 0 , hr : 12 }} 
                onChange={value => setData("time" , value)} />
            
            <ReminderDesc 
                value={data?.desc || ""} 
                onChange={value => setData("desc" , value)} />

            <button 
                onClick={createReminderHandler} 
                disabled={reminderDisableChecker()} 
                className="reminderPlayground__createTrigger">
                <p>Create Reminder</p>
            </button>
        </div>
    )
}


export default ReminderPlayground;