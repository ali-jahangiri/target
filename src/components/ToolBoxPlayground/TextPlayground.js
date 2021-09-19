import PlaygroundTextArea from "./PlaygroundTextArea"

const TextPlayground = ({ value , onChange }) => {

    return (
        <div className="textPlayground">
            <PlaygroundTextArea 
                value={value} 
                onChange={onChange} 
                placeholder="Start Write your Text from here"
                className="textPlayground__textarea"
            />
        </div>
    )
}



export default TextPlayground;