import React from "react";
import { colors, getRandomItem } from "../../utils";

const StreamItemDirectory = React.forwardRef((props , ref) => {
    return (
        props.items.map((el) => <div key={el.i} style={{background : `#${getRandomItem(colors)}` , userSelect : "none" }}></div>)
    )
})

export default StreamItemDirectory;