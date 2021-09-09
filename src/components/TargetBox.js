import React, { useCallback } from "react";
import { useState } from "react";
import { useHistory } from "react-router";

import useKayBaseState from "../Hook/useKeyBaseState";

import Input from './Input';
import DeleteBoxHabitOfTarget from "./DeleteBoxHabitOfTarget";
import ColorSuggest from "./ColorSuggest";

import { debounce, idGenerator, requests, selfClearTimeout } from "../utils"

const TargetBox = ({ targetName , color , habit = [] , id}) => {
    const [inputValues , setInputValues] = useKayBaseState({});
    const [isActive, setIsActive] = useState(false);
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [isInDeletingProcess, setIsInDeletingProcess] = useState(false);

    const history = useHistory();


    const createNewHabit = e => {
        e.preventDefault();
        requests.target.addNewHabitToTarget(id , { name : inputValues?.newHabit , id : idGenerator() });
        setInputValues("newHabit" , "");
    }


    const deleteHabit = habitNameForDelete => {
        const currentItemForDelete = habit.find(el => el.id === habitNameForDelete)
        requests.target.deleteTargetHabit(id , currentItemForDelete)
    }

    const deleteEntireTarget = () => {
        setIsInDeletingProcess(true);
        selfClearTimeout(() => {
            requests.target.deleteTarget(id)
                .then(_ => requests.habitPerWeek.deleteEntireSchedule(id))
        } , 2000);
    }


    const editTargetHandler = () => setIsInEditMode(prev => !prev);


    const selectColorHandler = passedColor => setInputValues("newColor" , passedColor);

    const clearDraftChange = e => {
        e.stopPropagation()
        setInputValues({});
        setIsInEditMode(false)
    }

    const saveChangeHandler = () => {
        const { newColor } = inputValues;
        if(newColor) {
            requests.target.editTarget(id , { color : newColor });
        }
        setInputValues({});
    }



    const targetNameChange = useCallback(debounce(targetName => {
        requests.target.editTarget(id , { targetName });
    } , 500) , []);

   const internalTargetNameChangeHandler = value => {
    targetNameChange(value)
    setInputValues("newTargetName" , value)
   }
    

   const redirectToTargetSchedule = () => {
       if(habit.length) {
            history.push(`/habitPerWeek/${id}`)
        }
   }

    return (
        <div style={{ backgroundColor : `#${inputValues?.newColor || color}` }} className={`targetBox ${isInDeletingProcess ? "targetBox--deleted" : ""}`}> 
            <div className="targetBox__innerContainer" style={{ width : "100%" }}>
                <div className="targetBox__header">
                    <div style={{ position : "relative" }}>
                        <Input
                            placeholder="Target"
                            disabled={!isInEditMode}
                            defaultValue={targetName}
                            onChange={internalTargetNameChangeHandler}
                            className={`targetBox__title ${isInEditMode ? "targetBox__title--active" : ""}`} 
                        />
                        {
                            !isInEditMode && !!habit.length && (<div 
                            className="targetBox__targetNameClickableOverlay"
                            onClick={redirectToTargetSchedule}></div>)
                        }
                    </div>
                    <div className="targetBox__controllerContainer">
                        <DeleteBoxHabitOfTarget changeResponsibleTextInto={inputValues?.newColor && <div onClick={clearDraftChange} className="targetBox__cancelDraftTrigger">Cancel</div>} renderSimple deleteHandler={deleteEntireTarget} />
                        <div onClick={editTargetHandler}>
                            {
                                (() => {
                                    if(inputValues?.newColor || inputValues?.newTargetName) return <p onClick={saveChangeHandler}>Save</p>;
                                    else if(isInEditMode) return <p onClick={clearDraftChange}>Back</p>
                                    else return <p>Edit</p>
                                })()
                            }
                        </div>
                    </div>
                </div>
                {
                    !!habit.length && <div className="targetBox__habitContainer">
                    {
                        habit.map((el , i) => <div className="targetBox__habitItem" style={{ background : `${color}` }} key={i}>
                            <p>{el.name}</p>
                            <DeleteBoxHabitOfTarget deleteHandler={() => deleteHabit(el.id)} />
                        </div>)
                    }
                    </div>
                }
                {
                    (inputValues?.newColor || isInEditMode) && <div style={{ backgroundColor : `#${inputValues.newColor}` }} className={`targetBox__growUpCircle ${inputValues.newColor ? "targetBox__growUpCircle--active" : ""}`}></div>
                }
                {
                    <ColorSuggest active={isInEditMode} selectedItem={inputValues?.newColor || color} selectHandler={selectColorHandler} />
                }
                <div className={`targetBox__createNewOne ${isActive || !habit.length ? "targetBox__createNewOne--active" : ""} ${isInEditMode ? "targetBox__createNewOne--hideBaseOnEdit" : ""}`}>
                   <form onSubmit={createNewHabit}>
                        <Input
                            onBlur={() => !inputValues?.newHabit && setIsActive(false)} 
                            onFocus={setIsActive}
                            value={inputValues?.newHabit || ""}
                            style={{ fontSize : "1rem" , margin : "-.5rem"}} 
                            placeholder={!habit.length ? "Create your first habit" : "Create New Habit"}
                            onChange={value => setInputValues("newHabit" , value)}
                            />
                        <button type="submit" disabled={!inputValues?.newHabit}>Create</button>
                   </form>
                </div>
            </div>
        </div>
    )
}

export default TargetBox;