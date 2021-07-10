const TodayHoursRow = ({ index ,  }) => {
    return (
        <div className="todayHoursRow">
            <p className="todayHoursRow__index">{+index < 10 ? `0${index}` : index}</p>
        </div>
    )
}


export default TodayHoursRow;