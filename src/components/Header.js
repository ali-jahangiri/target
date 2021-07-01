import { useLayoutEffect, useState } from "react";
import { useSelector } from "../Store/Y-State";

const pickRandomItem = list => {
    return list[Math.floor(Math.random() * list.length)]
}

const Header = ({ children }) => {  
    const [currentImage, setCurrentImage] = useState("");
    const image = useSelector(state => state.artwork);
    useLayoutEffect(() => {
        setCurrentImage(pickRandomItem(image));
    } ,[])
    return (
        <div style={{ backgroundImage : `url(${currentImage})` }} className="pageHeader">
            <div className="pageHeader__container">
                <p className="pageHeader__title">{children}</p>
            </div>
        </div>
    )
}

export default Header;