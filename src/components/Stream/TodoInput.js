import { useLayoutEffect, useRef } from "react";
import { selfClearTimeout } from "../../utils";

const TodoInput = ({ value , onChange , hashtagInterpolate , shouldFocus }) => {
    const inputRef = useRef();

    useLayoutEffect(() => {
        if(shouldFocus) {
            selfClearTimeout(() => inputRef.current.focus() , 2500);
        }
    } , [shouldFocus]);

    return <input
                className={`todoInjector__input ${hashtagInterpolate ? "todoInjector__input--interpolate" : ""}`} 
                placeholder={`Write something`} 
                value={value} 
                ref={inputRef}
                onChange={({ target : { value } }) => onChange(value)} />
}


export default TodoInput;