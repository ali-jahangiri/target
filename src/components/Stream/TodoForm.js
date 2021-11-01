import { useState } from "react";
import client from "../../client";
import { fillInputValueWithCommend, selfClearTimeout } from "../../utils";
import TodoInput from "./TodoInput";

const TodoForm = ({
    inputValue ,
    setInputValue ,
    inputValueContainsHash,
    setInputValueContainsHash ,
    haveCompletedHash ,
    setHaveCompleteHash,
    isInFullScreen ,
    setToFullScreen ,
    isSidebarOpen ,
}) => {
    const [flashDestroy, setFlashDestroy] = useState(false);


    const inputValueChangeHandler = value => {
        setInputValue(value);
        
        if(value.startsWith("#")) {
            setInputValueContainsHash(true);
            selfClearTimeout(() => {
                setFlashDestroy(true);
            } , 700);
        }
        else {
            setInputValueContainsHash(false);
            setFlashDestroy(false);
        }

        if(haveCompletedHash) setHaveCompleteHash(false);
        if(!value || isInFullScreen) setToFullScreen(false);
    }


    const interpolateSubmitHandler = (e) => {
        e.preventDefault();
        const leanedCommendFormInputValue = inputValue?.slice(1);

        if(inputValue && leanedCommendFormInputValue && !haveCompletedHash){
            const haveHelperInterpolateCommand = client.STATIC.command.find(el => el.startsWith(leanedCommendFormInputValue));
            if(haveHelperInterpolateCommand) {
                if(leanedCommendFormInputValue !== haveHelperInterpolateCommand) {
                    // if user don't type entire of commend , we help to fill input with target commend 
                    fillInputValueWithCommend(haveHelperInterpolateCommand , inputValue , setInputValue , passedNewValue => {
                        setToFullScreen(client.STATIC.commendScreenSize[passedNewValue.slice(1)]);
                        setHaveCompleteHash(true);
                    })
                }else {
                    setToFullScreen(client.STATIC.commendScreenSize[leanedCommendFormInputValue]);
                    setHaveCompleteHash(true);
                }
            }
        }
    }

    return (
        <form onSubmit={interpolateSubmitHandler}>
            <div style={{ width : "90%" }}>
                {
                    inputValueContainsHash && <p style={{ color : !!inputValue.slice(1) && "grey" }} className="todoInjector__helperPlayground"><span style={{ color : "white" }}>#</span>{!!inputValue.slice(1) ? client.STATIC.command.find(el => el.startsWith(inputValue.slice(1)) && el.includes(inputValue.slice(1)))?.split('').map((el , i) => <span key={i} style={{ color : i + 1 < inputValue.length ? "white" : "grey" }}>{el}</span>) : 'Write a commend'}</p>
                }
                    <TodoInput
                        shouldFocus={isSidebarOpen}
                        value={inputValue} 
                        onChange={inputValueChangeHandler} 
                        hashtagInterpolate={inputValueContainsHash}
                    />
                {
                    (!flashDestroy && inputValueContainsHash) && <span className="todoInjector__flash"></span>
                }
                <div className={`todoInjector__dragHandHelper ${inputValue && !inputValueContainsHash ? "todoInjector__dragHandHelper--active" : ""}`} />
            </div>
        </form>
    )
}



export default TodoForm;