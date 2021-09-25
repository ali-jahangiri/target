import useKeyBaseState from "../../Hook/useKeyBaseState";
import Input from "../Input";
import ReminderDesc from "./ReminderDesc";
import ReminderTimePicker from "./ReminderTimePicker";

const ReminderPlayground = () => {
    const [data , setData] = useKeyBaseState({ title : "" ,  });

    const titleInputChange = value => {
        setData("title" , value);
    }


    const createReminderHandler = () => {
        console.log(data , "daa");
    }

    const reminderDisableChecker = () => {
        const { title , time ,desc } = data;
        if(title && time && desc) {
            return false
        }else return true;
    }
    
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
            <ReminderDesc value={data?.desc} onChange={value => setData("desc" , value)} />

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