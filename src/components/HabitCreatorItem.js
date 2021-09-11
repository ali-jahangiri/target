import Input from "./Input";

const HabitCreatorItem = ({ index , children , bgColor , changeHandler , removeHandler }) => {

    const style = (() => {
        if(bgColor) {
            return {
                backgroundColor : `#${bgColor}`
            }
        }else return undefined
    })()

    const onChange = newValue => {
        changeHandler(index - 1 , newValue);
    }   

    return (
        <div className="habitCreatorItem col-md-4">
            <div style={style} className="habitCreatorItem__container">
                <div className="habitCreatorItem__index">
                    {index}
                </div>
                <Input
                    containerStyle={{ width : "80%" }}
                    value={children.name}
                    style={{ fontSize : "2.5rem" }}
                    onChange={onChange} />
                <div onClick={() => removeHandler(children.id)} className="habitCreatorItem__removeTrigger">
                    <p>Delete</p>
                </div>
            </div>
        </div>
    )   
}


export default HabitCreatorItem;