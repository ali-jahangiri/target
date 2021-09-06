const colors = ['345B63' , "D4ECDD" , "C36839" , "5F7A61" , "3E2C41" , "C3BA85" , "FFB740" , "C2B8A3" , "402218" , "161616" , "511281" , "91C788" , "D44000" , "536162" , "AC0D0D" , "7868E6", "BFB051" , "F3F4ED"]
console.log(colors.length);
const ColorSuggest = ({ selectHandler , selectedItem = "" , active }) => {
    return (
        <div className={`colorSuggest ${active ? "colorSuggest--active" : ""}`}>
            {
                colors.map((el, i) => 
                    <div 
                        onClick={() => selectHandler(selectedItem === el ? "" : el)} 
                        style={{ backgroundColor : selectedItem === el ? "white" : `#${el}` }} 
                        key={i} >
                        {selectedItem === el && <div className="colorSuggest__selectedBox">
                                <div style={{ backgroundColor : `#${el}` }}></div>
                                    <p>Selected</p>
                                </div>
                        }
                    </div>
                )
            }
        </div>
    )
}

export default ColorSuggest;