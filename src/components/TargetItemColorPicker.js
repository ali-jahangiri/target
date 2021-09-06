import { colors } from "../utils";
import LoaderConcept from "./LoaderConcept";

const sentence = "You can pick a color for your current Target"
const suggestedColor = sentence.split(" ").map((el , i) => ({ color : colors[i], label : el }))

const Color = ({ onSelect , color , label , selectedColor}) => {
    const thisItemSelected = selectedColor === color;
    return (
        <span 
            onClick={() => onSelect(color)} 
            className={`targetItemColorPicker__color ${ thisItemSelected? "targetItemColorPicker__color--active" : ""}`}
            style={{  
                    color : `#${color}` , 
                    textDecorationColor : thisItemSelected ? `#${color}` : 'transparent' ,
                    opacity : !selectedColor || thisItemSelected ? 1 : .5 ,
                    fontSize: selectedColor ?  (thisItemSelected ? "3rem" : "2rem") : '3rem'
            }}
            > { label } </span>
    )
}

const TargetItemColorPicker = ({ selectedColor , onChange , onDone , isPend }) => {

    return (
        <div className="targetItemColorPicker">
            <div className="targetItemColorPicker__container">
                {
                    suggestedColor.map((el , i) => (
                        <Color selectedColor={selectedColor} onSelect={onChange} {...el} key={i} />
                    ))
                }
            </div>
            <div
                className="targetItemColorPicker__doneTrigger" 
                onClick={onDone}>
                    and Go
                    {
                        isPend && <LoaderConcept symbolColor={`#${selectedColor}`} style={{ marginLeft : "1rem" }} />
                    }
            </div>
        </div>
    )
}


export default TargetItemColorPicker;