const StreamResizeTrigger = ({ isInResizing }) => (
    <div className={`streamResizeTrigger ${isInResizing ? "streamResizeTrigger--active" : ""}`}></div>
)


export default StreamResizeTrigger;