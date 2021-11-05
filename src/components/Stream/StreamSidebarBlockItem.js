import { idGenerator } from "../../utils";

const StreamSidebarBlockItem = ({ color , name , alreadyUse , isInDragging , setIsInDragging}) => {
    return <div 
        draggable={true} 
        unselectable="on"
        onDragStart={e => {
            setIsInDragging(true);
            e.dataTransfer.setData("details", JSON.stringify({name , color , i : idGenerator() , type : "habit"}))}
        } 
        style={{backgroundColor: `#${color || "dcdcdc"}`}}
        className={`sliderHabitBlock__habitItem__container droppable-element ${isInDragging ? "sliderHabitBlock__habitItem__container--getFull" : ""}`}>
        <p>{name}</p>
        {
            alreadyUse && <div><p>Already Used</p></div>
        }
    </div>
}


export default StreamSidebarBlockItem;