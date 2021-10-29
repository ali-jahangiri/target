import { useState } from "react";

const PreventOverlayDisableStream = ({ protectFrom }) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <div 
            style={{ height :  protectFrom?.getClientRects()[0].height || 0 }} 
            onMouseDown={setIsPressed} 
            onMouseUp={() => setIsPressed(false)} 
            className={`preventOverlayDisableStream ${isPressed ? "preventOverlayDisableStream--pressed" : ""}`} />
    )
}

export default PreventOverlayDisableStream;