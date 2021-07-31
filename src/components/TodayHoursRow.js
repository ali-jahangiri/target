const TodayHoursRow = ({ index, isInTimeLine, indexInTimeline }) => {
  return (
    <div className={`todayHoursRow ${isInTimeLine ? "todayHoursRow--timelineSelected" : ""}`}>
      <p 
        style={{ transitionDelay: isInTimeLine || indexInTimeline !== false ? `${indexInTimeline * 500}ms`: 0,}}
        className="todayHoursRow__index">
        {+index < 10 ? `0${index}` : index}
      </p>
    </div>
  );
};

export default TodayHoursRow;
