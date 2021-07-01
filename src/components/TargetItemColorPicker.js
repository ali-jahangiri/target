const colors = [
    {
        color : "7952B3",
        label : "You",
    },
    {
        color : "FFC107",
        label : "can",
    },
    {
        color : "5F939A",
        label : "pick",
    },
    {
        color : "E2703A",
        label : "a",
    },
    {
        color : "3A6351",
        label : "color",
    },
    {
        color : "C2B8A3",
        label : "for",
    },
    {
        color : "FF616D",
        label : "your",
    },
    {
        color : "A2DBFA",
        label : "Target",
    },
]

const Color = ({ onSelect , color , label , selectedColor}) => {
    const thisItemSelected = selectedColor === color
    return (
        <span 
            onClick={() => onSelect(color)} 
            className={`targetItemColorPicker__color ${ thisItemSelected? "targetItemColorPicker__color--active" : ""}`}
            style={{  
                    color : `#${color}` , 
                    textDecorationColor : thisItemSelected ? `#${color}` : 'transparent' ,
                    opacity : !selectedColor || thisItemSelected ? 1 : .5 }}> { label } </span>
    )
}

const TargetItemColorPicker = ({ selectedColor , onChange , onDone }) => {
    
    return (
        <div className="targetItemColorPicker">
            <div className="targetItemColorPicker__title">
                {
                    colors.map((el , i) => (
                        <Color selectedColor={selectedColor} onSelect={onChange} {...el} key={i} />
                    ))
                }
                <span className="targetItemColorPicker__doneTrigger" onClick={onDone}>and Go !</span>
            </div>
        </div>
    )
}


export default TargetItemColorPicker;