import TextareaAutosize from "react-textarea-autosize";

const ReminderDesc = ({ value , onChange }) => {
    return (
        <div className="reminderDesc">
            <TextareaAutosize
                placeholder="What is reminder about ?"
                value={value}
                onChange={({ target : { value } }) => onChange(value)}
            />
        </div>
    )
}


export default ReminderDesc;