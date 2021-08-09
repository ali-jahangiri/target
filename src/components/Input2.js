import { useRef } from "react";
import { useState } from "react";


const Input2 = ({ value = '' , onChang , placeholder , containerStyle , inputStyle , placeholderStyle , fullWith , icon }) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef();
    return (
        <div style={containerStyle} className="input2">

            <p style={placeholderStyle} onClick={() => {
                inputRef.current?.focus()
                setIsFocused(true)
            }} className={`input2__placeholder ${isFocused || value ? 'input2__placeholder--focused' : ""}`}>{placeholder}</p>
            <input
                style={inputStyle}
                ref={inputRef}
                onFocus={setIsFocused}
                onBlur={() => setIsFocused(false)}
                value={value}
                onChange={({ target : { value } }) => onChang(value)} />
        </div>
    )
}


export default Input2;