const StreamSidebarBlockItem = ({ color , name , alreadyUse }) => {
    return <div style={{backgroundColor: `#${color || "dcdcdc"}`}}
        className="sliderHabitBlock__habitItem__container">
        <p>{name}</p>
        {
            alreadyUse && <div><p>Already Used</p></div>
        }
    </div>
}


export default StreamSidebarBlockItem;