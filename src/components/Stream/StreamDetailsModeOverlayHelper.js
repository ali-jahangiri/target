const StreamDetailsModeOverlayHelper = ({ isInDestroy , timelineDetails }) => {
    return (
        <div className={`streamDetailsModeOverlayHelper ${isInDestroy ? "streamDetailsModeOverlayHelper--inDestroyProcess" : ""}`}>
          <span style={{ height: timelineDetails.height , top : timelineDetails.topPosition }} className={`streamDetailsModeOverlayHelper__timeline ${timelineDetails.topPosition ? "streamDetailsModeOverlayHelper__timeline--haveTopDistance" : ""}`}>
            <span></span>
          </span>
        </div>
    )
}

export default StreamDetailsModeOverlayHelper;