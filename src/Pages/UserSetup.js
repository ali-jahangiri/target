import { useState } from "react";
import Btn from "../components/Btn";
import Input from "../components/Input";
import db from "../firebase";

const UserSetup = ({ history }) => {
    const [value, setValue] = useState("");

    const setUserHandler = () => {
        console.log(value);
        db.collection('user').add({ userName : value })
            .then(_ => {
                history.push('/')
            })
    }

    return (
        <div className="container setup">
            <p >welcome</p>
            <Input mode="dark" value={value} onChange={setValue} placeholder="Enter your Email" />
            {
                value.trim() && 
                <Btn onClick={setUserHandler} style={{ alignSelf : "flex-end", color : "white" }}>
                    Let's Go!
                </Btn>
            }
        </div>
    )
}   


export default UserSetup;