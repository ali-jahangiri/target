import { useRef } from "react";

const TodoInput = ({ value , onChange , hashtagInterpolate }) => {
    const inputRef = useRef();

    return <input 
                className={`todoInjector__input ${hashtagInterpolate ? "todoInjector__input--interpolate" : ""}`} 
                placeholder={`Write something`} 
                value={value} 
                ref={inputRef}
                onChange={onChange} />
}


export default TodoInput;