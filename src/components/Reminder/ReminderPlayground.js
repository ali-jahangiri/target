import useKeyBaseState from "../../Hook/useKeyBaseState";
import { debounce } from "../../utils";
import Input from "../Input";
import ReminderDesc from "./ReminderDesc";
import ReminderTimePicker from "./ReminderTimePicker";

const ReminderPlayground = ({ createHandler }) => {
    const [data , setData] = useKeyBaseState({ title : "" ,  });

    const titleInputChange = debounce(value => {
        setData("title" , value);
    } , 300);


    const createReminderHandler = () => {
        console.log(data , "daa");
    }

    const reminderDisableCheder = () =>{
        const { title , time ,desc } = data;
        if(title && time && desc) {
            return true   
        }else return false;
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

            <button disabled={reminderDisableCheder()} className="reminderPlayground__createTrigger">
                <p onClick={createReminderHandler}>Create Reminder</p>
            </button>
        </div>
    )
}


export default ReminderPlayground;