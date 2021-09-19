import TextareaAutosize from "react-textarea-autosize";

const PlaygroundTextArea = ({ placeholder , value , onChange , className , ...rest }) => {
    return (
        <TextareaAutosize
                minRows={1}
                value={value}
                placeholder={placeholder}
                onChange={({ target : { value } }) => onChange(value)}
                className={`playgroundTextArea ${className}`}
                {...rest} />
    )
}



export default PlaygroundTextArea;