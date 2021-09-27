import useKeyBaseState from "../../Hook/useKeyBaseState";
import Input from "../Input";
import ReminderDesc from "./ReminderDesc";
import ReminderTimePicker from "./ReminderTimePicker";

import requests from "../../utils/requests";
import { useEffect, useState } from "react";
import { selfClearTimeout } from "../../utils";
import ReminderListDirectory from "./ReminderListDirectory";
import { Reminder } from "../../utils/modules";

const ReminderPlayground = ({ leanDate }) => {
    const [data , setData] = useKeyBaseState({ title : "" ,  desc : "" , time : { min : 0 , hr : 12 }});
    const [wasReminderSet, setWasReminderSet] = useState(false);
    const [reminderList, setReminderList] = useState(null);

    useEffect(() => {
        requests.commends.reminder.getReminderList(leanDate , setReminderList)
    } , []);

    console.log(reminderList);
    
    const titleInputChange = value => {
        setData("title" , value);
    }


    const createReminderHandler = () => {
        const { title , desc , time } = data;
        requests.commends.reminder.setReminder(leanDate , new Reminder(title , desc , time) )
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
                value={data.time} 
                onChange={value => setData("time" , value)} />
            
            <ReminderDesc 
                value={data?.desc} 
                onChange={value => setData("desc" , value)} />

            <button 
                onClick={createReminderHandler} 
                disabled={reminderDisableChecker()} 
                className="reminderPlayground__createTrigger">
                <p>Create Reminder</p>
            </button>
            {
                reminderList && <ReminderListDirectory reminderList={reminderList} />
            }
        </div>
    )
}


export default ReminderPlayground;