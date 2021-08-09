import { useLayoutEffect, useState } from "react";


const Header = ({ children }) => {  
    const [currentImage, setCurrentImage] = useState("");
    return (
        <div style={{ backgroundImage : `url(${currentImage})` }} className="pageHeader">
            <div className="pageHeader__container">
                <p className="pageHeader__title">{children}</p>
            </div>
        </div>
    )
}

export default Header;