import { useRef, useState } from "react";

import Input from "./Input";
import Btn from "./Btn";
import HabitCreatorItem from "./HabitCreatorItem";
import { idGenerator } from "../utils";

const HabitListCreator = ({ onChange , habit , haveTargetColor }) => {
    const [value, setValue] = useState("");
    
    const inputRef = useRef()
    
    const inputCreatorChangeHandler = inputValue => {
        setValue(inputValue)
    }

    const createNewHabitHandler = () => {
        onChange('habit' , [...habit , { id : idGenerator() , name : value }])
        setValue("");
        inputRef.current.focus();
    }


    const habitDeleteHandler = habitId => {
        onChange("habit" , habit.filter(el => el.id !== habitId))
    }


    const habitEditHandler = (index , newValue) => {
        const newHabitList = [...habit];
        newHabitList[index] = {
            id : newHabitList[index].id,
            name : newValue
        }
        onChange('habit' , [...newHabitList]);
    }
    

    return (
        <div className="habitListCreator">
            <div className="row habitListCreator__directory">
                {
                    habit.map((el , i) => (
                        <HabitCreatorItem 
                            key={i}
                            changeHandler={habitEditHandler} 
                            bgColor={haveTargetColor} 
                            index={i + 1}
                            removeHandler={habitDeleteHandler} >
                            {el}
                        </HabitCreatorItem>
                    ))
                }
            </div>
            <form onSubmit={e => e.preventDefault()} className="habitListCreator__inputPart">
                <Input
                    containerStyle={{ width : "100%" }}
                    reference={inputRef}
                    onChange={inputCreatorChangeHandler}
                    value={value}
                    placeholder="Which habits help you to achieve target ?"
                />
                {
                    value && 
                    <Btn type="submit" style={{ backgroundColor : "white" }} onClick={createNewHabitHandler}>
                        Add
                    </Btn>
                }
            </form>
        </div>
    )
}


export default HabitListCreator;