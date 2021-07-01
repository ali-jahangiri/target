import { useState } from "react";

const Input = ({ placeholder , value , onChange , showLabel , reference , style , onBlur }) => {
    const [haveValue, setHaveValue] = useState(false);

    const changeHandler = value => {
        onChange(value)
        value ? setHaveValue(true) : setHaveValue(false)
    }
    return (
        <div className="inputCustom__container">
            <input
                onBlur={onBlur}
                style={style}
                ref={reference}
                className="inputCustom" 
                placeholder={placeholder} 
                value={value} 
                onChange={({ target : { value } }) => changeHandler(value)} />
                {
                    haveValue && showLabel && <p>as <span>{placeholder}</span></p>
                }
        </div>
    )
}   

export default Input;