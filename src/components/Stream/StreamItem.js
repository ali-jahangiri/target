import { useRef , useEffect , useState, useLayoutEffect } from "react";
import { Resizable } from "re-resizable";
import { Draggable } from "react-beautiful-dnd";
import { CgClose } from "react-icons/cg";
import { FiMoreHorizontal } from "react-icons/fi";

import DetailsOptionsMenu from "../DetailsOptionMenu";
import StreamResizeTrigger from "./StreamResizeTrigger";

import WritableDetails from "./WritableDetails";
import { selfClearTimeout } from "../../utils";
import StreamOverHour from "./StreamOverHour";

const StreamItem = ({ 
    detailsShowHandler, 
    id, 
    sidebarClosedByUser, 
    index, 
    setIsSidebarOpen, 
    color, 
    habitName, 
    resizeHandler, 
    hoursGoNext, 
    setNthChildHandler, 
    isInDragging, 
    isInResizing, 
    isInDetailsMode, 
    habitInStream, 
    snapshot , 
    setCurrentInProgressBlock,
    deleteTimeoutRef , 
    setCurrentItemInDeleteProcess , 
    currentItemInDeleteProcess , 
    leanDate
}) => {

    const [forcer, setForcer] = useState(Date.now())
    const [internalH, setInternalH] = useState(0);
    const [isDetailsOptionMenuOpen, setIsDetailsOptionMenuOpen] = useState(false);
    const [detailsActive, setDetailsActive] = useState(false);
    const [position, setPosition] = useState(0);
    const [isDetailsInCloseProcess, setIsDetailsInCloseProcess] = useState(false);

    const mainContainerRef = useRef();

    const internalResizeHandler = (e, dir, ref, d) => {
      setInternalH(d.height);
      setIsSidebarOpen(false);
      setNthChildHandler(id);
    };
  
    const resizeEndHandler = () => {
      resizeHandler({ id, height: internalH, index });
      setNthChildHandler(false);
      !sidebarClosedByUser && setIsSidebarOpen(true);
    };
  
    
    
    useEffect(() => setForcer(Date.now()) , [hoursGoNext]);
    let availableNextHours = (24 - (index + hoursGoNext)) - position;

    const determineHandler = () => setIsDetailsOptionMenuOpen(false)

    useEffect(function calculateAvailableNextHr() {
      const validStream = habitInStream.filter(el => el.name);
      const targetStreamForSelectIndex = validStream.findIndex(el => el.id === id);
      const pureArrayBeforeCurrentSelectedStream = [...validStream].splice(0 , targetStreamForSelectIndex)
      const pushCountFromAboveBlocks = pureArrayBeforeCurrentSelectedStream.reduce((acc , res) => acc + res.hoursGoNext , 0) - pureArrayBeforeCurrentSelectedStream.length;
      let start = index + pushCountFromAboveBlocks;
      const end = start + hoursGoNext;

      setPosition(pushCountFromAboveBlocks)
    }, [habitInStream, hoursGoNext, id, index])


    const closeHandler = () => {
      if(isInDetailsMode) {
        setIsDetailsInCloseProcess(true)
        selfClearTimeout(() => {
          setIsDetailsInCloseProcess(false)
          setIsDetailsOptionMenuOpen(false)
          setDetailsActive(false)
          detailsShowHandler();
        } , 400)
      }else {
        setIsDetailsOptionMenuOpen(false)
        // change current stream item mode to nothing - we don't specify any mode
        setDetailsActive(false)
        // tell to parent handler that we are done this this side and pass nothing to detailsShowHandler method
        detailsShowHandler();
      }
    }

    const showDetailsHandler = () => {
      if(detailsActive) {
        setIsDetailsOptionMenuOpen(true);
      }else {
        const validStream = habitInStream.filter(el => el.name);
        const targetStreamForSelectIndex = validStream.findIndex(el => el.id === id);
        const pureArrayBeforeCurrentSelectedStream = [...validStream].splice(0 , targetStreamForSelectIndex)
        const hh = pureArrayBeforeCurrentSelectedStream.reduce((acc , res) => acc + res.hoursGoNext , 0) - pureArrayBeforeCurrentSelectedStream.length;
  
        document.getElementsByClassName('mainContainer')[0]
                .scroll({ top : (index + hh) * 100 , behavior : "smooth" })
  
        let start = index + hh;
        const end = start + hoursGoNext;
        
        const possibleStep = new Array(end - start).fill("").map((_) => ++start);

        detailsShowHandler(id , possibleStep , mainContainerRef.current.resizable);
        setDetailsActive(true)
      }
      
    };


    useEffect(() => {
      if(!snapshot.isDraggingOver && !currentItemInDeleteProcess) {
        setCurrentItemInDeleteProcess(snapshot.draggingFromThisWith)
      }
    }, [snapshot]);


    const cancelDeleteProcess = () => {
      clearTimeout(deleteTimeoutRef.current)
      setCurrentItemInDeleteProcess(null);
    }

    const internalPassingUpCurrentInProgressBlockHandler = shouldPassToTop => {
      if(shouldPassToTop) {
        setCurrentInProgressBlock((index + position )* 100)
      }
    }
  
    return (
      <Draggable isDragDisabled={isInDetailsMode} draggableId={id} index={index}>
        {(provided) => (
          <Resizable
            key={forcer}
            onResize={internalResizeHandler}
            onResizeStop={resizeEndHandler}
            width="100%"
            maxWidth="100%"
            maxHeight={!availableNextHours ? (hoursGoNext * 100) : ((availableNextHours * 100) + (hoursGoNext * 100))}
            minHeight={100}
            defaultSize={{ width: "100%", height: hoursGoNext * 100 }}
            ref={mainContainerRef}
            className={`habitMainContainer ${isInDetailsMode ? "habitMainContainer--inDetailsMode" : ""}`}
            enable={{ bottom: !isInDetailsMode && index + hoursGoNext !== 24 ? true : false }}
            grid={[100, 100]}
            handleComponent={{bottom: currentItemInDeleteProcess !== id && <StreamResizeTrigger isInResizing={isInResizing === id} /> }} >
            {isDetailsOptionMenuOpen && <DetailsOptionsMenu closeHandler={determineHandler} bgColor={color} /> }
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`streamItem ${isInDragging ? "streamItem--hideResizeTrigger" : ""} ${detailsActive ? "streamItem--overflowHidden" : ""}`}>
                <StreamOverHour setIsInProgress={internalPassingUpCurrentInProgressBlockHandler} isInDetailsMode={isInDetailsMode} startPoint={(position + index) * 100} endPoint={(position + index + hoursGoNext) * 100} />
              <div
                onClick={() => currentItemInDeleteProcess === id && cancelDeleteProcess()}
                className={`streamItem__container ${currentItemInDeleteProcess === id ? "streamItem__container--delete" : ""}`}
                style={{ backgroundColor: `#${color || "dcdcdc"}` }}>
                  {(() => {
                    if(currentItemInDeleteProcess === id) {
                      return (
                        <div onClick={cancelDeleteProcess}>Deleting are you sure ? you can cancel it if you wish ?</div>
                      )
                    }else return <>
                      <div className={`streamItem__innerContainer ${isInDetailsMode ? "streamItem__innerContainer--setUp" : ""}`} >
                        <p>{habitName}</p>
                        <div className="streamItem__detailsModeCtaContainer">
                          <div
                            onClick={showDetailsHandler}
                            className={`streamItem__detailsTrigger ${isInDetailsMode? "streamItem__detailsTrigger--rotate": ""}`} >
                            <FiMoreHorizontal />
                          </div>
                          <div onClick={closeHandler} className={`determiner ${isInDetailsMode ? "determiner--active" : ""}`} >
                            <div className="visible">
                              <CgClose />
                            </div>
                          </div>
                        </div>
                      </div>
                      {isInDetailsMode && <WritableDetails streamId={leanDate} isInCloseProcess={isDetailsInCloseProcess} />}
                    </>
                  })()}
              </div>
            </div>
          </Resizable>
        )}
      </Draggable>
    );
  };



  export default StreamItem