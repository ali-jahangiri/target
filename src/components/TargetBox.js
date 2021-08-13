const TargetBox = ({ targetName , color , habit = [] }) => {
    return (
        <div className="targetBox"> 
            <p className="targetBox__title">{targetName}</p>
            <div className="targetBox__habitContainer">
                {
                    habit.map((el , i) => <div className="targetBox__habitItem" style={{ background : `${color}` }} key={i}>{el.name}</div>)
                }
            </div>
        </div>
    )
}

export default TargetBox;