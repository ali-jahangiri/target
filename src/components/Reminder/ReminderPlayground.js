import { useState } from "react";
import useKeyBaseState from "../../Hook/useKeyBaseState";
import { debounce } from "../../utils";
import Input from "../Input";
import ReminderTimePicker from "./ReminderTimePicker";

const ReminderPlayground = ({  }) => {
    const [data , setData] = useKeyBaseState({ title : "" ,  })

    const titleInputChange = debounce(value => {
        setData("title" , value)
    } , 300)


    return (
        <div className="reminderPlayground">
            <Input
                labelStyle={{ fontSize : "1.2rem" }}
                style={{ fontSize : "2rem" }}
                mode="dark"
                showLabel 
                placeholder="Reminder Title"
                onChange={titleInputChange}
                />
            <ReminderTimePicker
                value={data.time} 
                onChange={value => setData("time" , value)} />
        </div>
    )
}


export default ReminderPlayground;