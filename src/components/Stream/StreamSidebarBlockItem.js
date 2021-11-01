const StreamSidebarBlockItem = ({ color , name , alreadyUse , isInDragging }) => {
    return <div style={{backgroundColor: `#${color || "dcdcdc"}`}}
        className={`sliderHabitBlock__habitItem__container ${isInDragging ? "sliderHabitBlock__habitItem__container--getFull" : ""}`}>
        <p>{name}</p>
        {
            alreadyUse && <div><p>Already Used</p></div>
        }
    </div>
}


export default StreamSidebarBlockItem;