const PlaygroundInput = ({ value , onChange , placeholder , className , inBlock , autoFocus , ...rest }) => {
    return (
        <input
            className={`playgroundInput ${inBlock ? "playgroundInput--inBlock" : ""} ${className}`}
            value={value} 
            autoFocus={autoFocus}
            onChange={({ target : { value } }) => onChange(value)} 
            placeholder={placeholder}
            {...rest}
            />
    )
}


export default PlaygroundInput;