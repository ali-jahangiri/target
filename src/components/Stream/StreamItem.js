import { useRef, useState } from "react";
import Portal from "../../Providers/Portal/Portal";
import { selfClearTimeout } from "../../utils";
import StreamDetails from "./StreamDetails";
import StreamOverHour from "./StreamOverHour";

const StreamItem = ({ 
    name , 
    color ,
    desc ,
    i : id,
    isToday , 
    isInDragging , 
    layout , 
    addToActiveBlockHandler , 
    setIsStreamControllerVisible , 
    changeStreamDetailsHandler,
}) => {
  
  const [isDetailsEnable, setIsDetailsEnable] = useState(false);
  const [portalPosition, setPortalPosition] = useState(null);
  const [showPortal, setShowPortal] = useState(false);
  const containerRef = useRef();

  const internalPassingUpCurrentInProgressBlockHandler = (shouldAddBlockToList) => {
    if(shouldAddBlockToList) addToActiveBlockHandler(shouldAddBlockToList);
  }

  const showDetailsHandler = status => {
    if(status) {
      document.body.style.overflow = 'hidden';
      setIsStreamControllerVisible(false);
      setIsDetailsEnable(true);
      setPortalPosition(containerRef.current.getClientRects()[0]);
      selfClearTimeout(() => {
        setShowPortal(true);
      } , 500)
    }
  }

  const closeDetailsHandler = () => {
    setShowPortal(false);
    setIsDetailsEnable(false)
    setIsStreamControllerVisible(true);
    document.body.style.overflow = 'auto';
  }

  const syncValueHandler = value => changeStreamDetailsHandler(id , 'desc' , value);

  return (
    <div ref={containerRef} className="streamItem">
      <div className={`streamItem__innerContainer ${false ? "streamItem__innerContainer--setUp" : ""}`} >
        <p onClick={showDetailsHandler}>{name}</p>
      </div>
        {
          isToday && <StreamOverHour
            shouldGetMinHight={isInDragging}
            setIsInProgress={internalPassingUpCurrentInProgressBlockHandler} 
            isInDetailsMode={isDetailsEnable}
            startPoint={layout.y * 100} 
            endPoint={(layout.y + layout.h) * 100} />
        }
        {
          showPortal && <Portal>
            <StreamDetails
              desc={desc}
              syncValueHandler={syncValueHandler}
              destroyTrigger={closeDetailsHandler}
              style={portalPosition} 
              color={color}
              name={name}
            />
          </Portal>
        }
    </div>
  )
}

export default StreamItem;