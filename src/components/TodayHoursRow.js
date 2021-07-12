const TodayHoursRow = ({ index , isInTimeLine  }) => {
    
    return (
        <div className={`todayHoursRow ${isInTimeLine ? "todayHoursRow--timelineSelected" : ""}`}>
            <p className="todayHoursRow__index">{+index < 10 ? `0${index}` : index}</p>
        </div>
    )
}


export default TodayHoursRow;