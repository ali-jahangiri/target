import { addZeroToAboveTenNumber } from "../../utils";

const ReminderItem = ({ title , desc , time , id , removeHandler }) => {
    return (
        <div className="reminderItem">
            <div className="reminderItem__title">
                <p>{title}</p>
            </div>
            <div className="reminderItem__desc">
                <p>{desc}</p>
            </div>
            <div className="reminderItem__time">
                <p><span>Settled for </span><span>{addZeroToAboveTenNumber(time.hr)}:{addZeroToAboveTenNumber(time.min)}</span></p>
            </div>
            <div className="reminderItem__controller">
                <p onClick={removeHandler}>Delete</p>
            </div>
        </div>
    )
}


export default ReminderItem;