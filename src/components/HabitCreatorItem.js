import { useState } from "react";
import Input from "./Input";

const HabitCreatorItem = ({ index , children , bgColor , changeHandler }) => {
    const [newValue, setNewValue] = useState(children.name);

    const style = (() => {
        if(bgColor) {
            return {
                backgroundColor : `#${bgColor}`
            }
        }else return undefined
    })()

    const onChange = () => {
        changeHandler(index - 1 , newValue)
    }   

    return (
        <div className="habitCreatorItem col-md-4">
            <div style={style} className="habitCreatorItem__container">
                <div className="habitCreatorItem__index">
                    {index}
                </div>
                <Input
                    onBlur={onChange}
                    value={newValue}
                    style={{ fontSize : "2.5rem" }}
                    onChange={value => setNewValue(value)} />
            </div>
        </div>
    )   
}


export default HabitCreatorItem;