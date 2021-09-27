import TextareaAutosize from "react-textarea-autosize";

const PlaygroundTextArea = ({ placeholder , value , onChange , className , inBlock , autoFocus , ...rest }) => {
    return (
        <TextareaAutosize
                autoFocus={autoFocus}
                minRows={1}
                value={value}
                placeholder={placeholder}
                onChange={({ target : { value } }) => onChange(value)}
                className={`playgroundTextArea ${inBlock ? "playgroundTextArea--inBlock" : ""} ${className}`}
                {...rest} />
    )
}



export default PlaygroundTextArea;