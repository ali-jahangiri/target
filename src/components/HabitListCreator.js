import { useRef, useState } from "react";

import Input from "./Input";
import Btn from "./Btn";
import HabitCreatorItem from "./HabitCreatorItem";
import { idGenerator } from "../utils";

const HabitListCreator = ({ onChange , habit , haveTargetColor }) => {
    const [value, setValue] = useState("");
    
    const inputRef = useRef()
    
    const changeHandler = inputValue => {
        setValue(inputValue)
    }

    const submitHandler = () => {
        onChange('habit' , [...habit , { id : idGenerator() , name : value }])
        setValue("");
        inputRef.current.focus();
    }

    const habitEditHandler = (index , newValue) => {
        const newHabitList = [...habit];
        newHabitList[index] = {
            id : newHabitList[index].id,
            name : newValue
        }
        onChange('habit' , [...newHabitList]);
    }
    

    const focusOnInputHandler = () => 
        inputRef.current?.focus();

    return (
        <div className="habitListCreator">
            {/* <p onClick={focusOnInputHandler} className="habitListCreator__title">Which habits help you to achieve target ? </p> */}
            <div className="row habitListCreator__directory">
                {
                    habit.map((el , i) => (
                        <HabitCreatorItem 
                            key={i}
                            changeHandler={habitEditHandler} 
                            bgColor={haveTargetColor} 
                            index={i + 1}>
                            {el}
                        </HabitCreatorItem>
                    ))
                }
            </div>
            <form onSubmit={e => e.preventDefault()} className="habitListCreator__inputPart">
                <Input
                    containerStyle={{ width : "100%" }}
                    reference={inputRef}
                    onChange={changeHandler}
                    value={value}
                    placeholder="Which habits help you to achieve target ? "
                />
                {
                    value && 
                    <Btn type="submit" style={{ backgroundColor : "white" }} onClick={submitHandler}>
                        Add
                    </Btn>
                }
            </form>
        </div>
    )
}


export default HabitListCreator;