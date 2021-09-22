import TextareaAutosize from "react-textarea-autosize";

const PlaygroundTextArea = ({ placeholder , value , onChange , className , inBlock , ...rest }) => {
    return (
        <TextareaAutosize
                autoFocus
                minRows={1}
                value={value}
                placeholder={placeholder}
                onChange={({ target : { value } }) => onChange(value)}
                className={`playgroundTextArea ${inBlock ? "playgroundTextArea--inBlock" : ""} ${className}`}
                {...rest} />
    )
}



export default PlaygroundTextArea;