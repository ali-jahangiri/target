import ReminderPlayground from "../CommandsPlayground/Reminder/ReminderPlayground";
import NotePlayground from "../CommandsPlayground/Note/NotePlayground";

const dynamicPlayground = rest => ({
    note : <NotePlayground {...rest} />,
    reminder : <ReminderPlayground {...rest} />,
})

const Commands = ({
    setInnerPlaygroundController,
    date,
    targetCommend
}) => dynamicPlayground({ setInnerPlaygroundController , date })[targetCommend];


export default Commands;