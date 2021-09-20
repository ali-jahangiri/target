const PlaygroundInput = ({ value , onChange , placeholder , className , ...rest }) => {
    return (
        <input
            className={`playgroundInput ${className}`}
            value={value} 
            autoFocus
            onChange={({ target : { value } }) => onChange(value)} 
            placeholder={placeholder}
            {...rest}
            />
    )
}


export default PlaygroundInput;