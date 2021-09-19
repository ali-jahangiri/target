const PlaygroundInput = ({ value , onChange , placeholder , className , ...rest }) => {
    console.log(className , "*****");
    return (
        <input
            className={`playgroundInput ${className}`}
            value={value} 
            onChange={({ target : { value } }) => onChange(value)} 
            placeholder={placeholder}
            {...rest}
            />
    )
}


export default PlaygroundInput;