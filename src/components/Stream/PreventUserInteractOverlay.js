import { useState } from "react";

const PreventUserInteractOverlay = ({ protectFrom }) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <div style={{ height :  protectFrom?.getClientRects()[0].height || 0 }} onMouseDown={setIsPressed} onMouseUp={() => setIsPressed(false)} className={`today__preventUserInteractOverlay ${isPressed ? "today__preventUserInteractOverlay--pressed" : ""}`} />
    )
}

export default PreventUserInteractOverlay;