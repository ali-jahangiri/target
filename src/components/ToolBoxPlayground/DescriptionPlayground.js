import { useState } from "react";
import PlaygroundTextArea from "./PlaygroundTextArea";

const DescriptionPlayground = ({  }) => {
    const [value, setValue] = useState("");

    return (
        <div className="descPlayground">
            <div className="descPlayground__container">
                <div className="descPlayground__avatarBox" />
                <PlaygroundTextArea
                    value={value}
                    onChange={setValue}
                    placeholder="start write your short description from here" 
                />
            </div>
        </div>
    )
}


export default DescriptionPlayground;