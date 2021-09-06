import { colors } from "../utils";

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