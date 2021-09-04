import React from "react";
import { useState } from "react";

import useKayBaseState from "../Hook/useKeyBaseState";

import Input from './Input';

import {idGenerator, requests} from "../utils"
import DeleteBoxHabitOfTarget from "./DeleteBoxHabitOfTarget";

const TargetBox = ({ targetName , color , habit = [] , deleteHandler , id}) => {
    const [inputValues , setInputValues] = useKayBaseState({});
    const [isActive, setIsActive] = useState(false);

    const createNewHabit = () => {
        requests.target.addNewHabitToTarget(id , { name : inputValues?.newHabit , id : idGenerator() })
    }


    const deleteHabit = habitNameForDelete => {
        requests.target.deleteTargetHabit(id , habitNameForDelete)
            .then(data => {
                console.log(data);
            })
    }

    const deleteEntireTarget = () => {

    }

    return (
        <div style={{ backgroundColor : `#${color}` }} className="targetBox"> 
            <div className="targetBox__innerContainer" style={{ width : "100%" }}>
                <div className="targetBox__header">
                    <p className="targetBox__title">{targetName}</p>
                    <div className="targetBox__controllerContainer">
                        <p onClick={deleteEntireTarget}>Delete</p>
                    </div>
                </div>
                <div className="targetBox__habitContainer">
                    {
                        habit.map((el , i) => <div className="targetBox__habitItem" style={{ background : `${color}` }} key={i}>
                            <p>{el.name}</p>
                            <DeleteBoxHabitOfTarget deleteHandler={() => deleteHabit(el.name)} />
                        </div>)
                    }
                </div>
                <div className={`targetBox__createNewOne ${isActive ? "targetBox__createNewOne--active" : ""}`}>
                    <Input
                        onBlur={() => !inputValues?.newHabit && setIsActive(false)} 
                        onFocus={setIsActive}
                        value={inputValues?.newHabit || ""}
                        style={{ fontSize : "1rem" , margin : "-.5rem"}} 
                        placeholder="Create New Habit"
                        onChange={value => setInputValues("newHabit" , value)}
                        />
                        <button onClick={createNewHabit} disabled={!inputValues?.newHabit}>Create</button>
                </div>
            </div>
        </div>
    )
}

export default TargetBox;