import { useEffect } from "react";

const MenuItem = ({ path , name , onHover , color , currentLocation , setCurrentActiveMenu , currentActiveMenu ,  redirectionHandler }) => {
    
    useEffect(() => {
        if(currentLocation === path) setCurrentActiveMenu({ path , color })
    } , [currentLocation])


    return (
        <div 
            onMouseLeave={() => onHover((currentActiveMenu === currentLocation) ? color : currentActiveMenu !== path ? currentActiveMenu.color : "3A6351")} 
            onMouseEnter={() => onHover(color)} 
            onClick={() => redirectionHandler(path)} 
            className={`menuItem ${currentActiveMenu.path === path ? "menuItem--active" : ""}`}>
            <p>{name}</p>
        </div>
    )
}


export default MenuItem;