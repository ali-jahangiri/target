const StreamSidebarBlockItem = ({ color , name , alreadyUse , isInDragging , dropStartHandler }) => {
    return <div draggable={true} unselectable="on" onDragStart={e => {
        console.log('start');
        dropStartHandler();
        e.dataTransfer.setData("text/plain", "");
    }} style={{backgroundColor: `#${color || "dcdcdc"}`}}
        className={`sliderHabitBlock__habitItem__container droppable-element ${isInDragging ? "sliderHabitBlock__habitItem__container--getFull" : ""}`}>
        <p>{name}</p>
        {
            alreadyUse && <div><p>Already Used</p></div>
        }
    </div>
}


export default StreamSidebarBlockItem;