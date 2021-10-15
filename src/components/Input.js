import { useState } from "react";

const Input = ({ placeholder , value , onChange , showLabel , reference , style , onBlur  , mode , containerStyle , labelStyle , ...rest }) => {
    const [haveValue, setHaveValue] = useState(false);

    const changeHandler = value => {
        onChange(value)
        value ? setHaveValue(true) : setHaveValue(false)
    }
    return (
        <div style={containerStyle} className={`inputCustom__container inputCustom__container--${mode}`}>
            <input
                onBlur={onBlur}
                style={style}
                ref={reference}
                className="inputCustom" 
                placeholder={placeholder} 
                value={value}
                onChange={({ target : { value } }) => changeHandler(value)}
                {...rest}
                />
                {
                    haveValue && showLabel && <p style={labelStyle}>as <span style={labelStyle}>{placeholder}</span></p>
                }
        </div>
    )
}   

export default Input;