import ReminderItem from "./ReminderItem";

const ReminderListDirectory = ({ reminderList }) => {
    return (
        <div className="reminderDirectory">
            <div className="reminderDirectory__header">
                <p>Create Reminder</p>
            </div>
            <div className="reminderDirectory__itemsContainer">
                {
                    reminderList.map((el , i) => <ReminderItem key={i} {...el} />)
                }
            </div>
        </div>
    )
}



export default ReminderListDirectory;