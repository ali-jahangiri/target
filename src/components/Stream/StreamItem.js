import { useRef , useEffect , useState } from "react";
import { Resizable } from "re-resizable";
import { Draggable } from "react-beautiful-dnd";
import { CgClose } from "react-icons/cg";
import { FiCheck, FiMoreHorizontal } from "react-icons/fi";
import { selfClearTimeout } from "../../utils";

import DetailsOptionsMenu from "../DetailsOptionMenu";
import StreamResizeTrigger from "./StreamResizeTrigger";



const WritableDetails = ({ value, onChange, placeholder = "write and save your idea about this habit..."}) => {
    const inputRef = useRef();
  
    useEffect(() => {
      selfClearTimeout(() => { 
        inputRef.current?.focus();
      }, 3000);
    }, [inputRef]);
  
    return (
      <input
        placeholder={placeholder}
        ref={inputRef}
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
        className="writableDetails"
      />
    );
  };
  
  const StreamItem = ({ detailsShowHandler, id, sidebarClosedByUser, index, setIsSidebarOpen, color, habitName, resizeHandler, hoursGoNext, setNthChildHandler, isInDragging, isInResizing, isInDetailsMode, setHabitInStream, habitInStream, snapshot , deleteTimeoutRef , setCurrentItemInDeleteProcess , currentItemInDeleteProcess}) => {

    const [forcer, setFourcer] = useState(Date.now())
    const [internalH, setInternalH] = useState(0);
    const [isDetailsOptionMenuOpen, setIsDetailsOptionMenuOpen] = useState(false);

    const [detailsActive, setDetailsActive] = useState(false);

    const [position, setposition] = useState(0);

    const mainContainerRef = useRef();
    
    const inputDetailsChangeHandler = (key, value) => {
      setHabitInStream((prev) => {
        return prev.map((el, i) => (el.id === id ? { ...el, [key]: value } : el));
      });
    };
  
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
  
    let availableNextHours = (24 - (index + hoursGoNext)) - position;
    const _initialWasSettled = !!habitInStream.find((el) => el.id === id)?._initial;
    
    
    useEffect(() => {
      setFourcer(Date.now())
    } , [hoursGoNext])


    const determineHandler = () => setIsDetailsOptionMenuOpen(false)

    useEffect(() => {
      const validStream = habitInStream.filter(el => el.name);
        const targetStreamForSelectIndex = validStream.findIndex(el => el.id === id);
        const pureArrayBeforeCurrentSelectedStream = [...validStream].splice(0 , targetStreamForSelectIndex)
        const hh = pureArrayBeforeCurrentSelectedStream.reduce((acc , res) => acc + res.hoursGoNext , 0) - pureArrayBeforeCurrentSelectedStream.length;
        let start = index + hh;
        const end = start + hoursGoNext;

        
        setposition(hh)

    })


    const closeHandler = () => {
      setIsDetailsOptionMenuOpen(false)
      // change current stream item mode to nothing - we don't specify any mode
      setDetailsActive(false)
      // tell to parent handler that we are done this this side and pass nothing to detailsShowHandler method
      detailsShowHandler();
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

    const renderChecker = () => {
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
          <div className={`${_initialWasSettled ? "visible" : ""}`}>
            <FiCheck />
          </div>
          <div className={`${!_initialWasSettled ? "visible" : ""}`}>
            <CgClose />
          </div>
        </div>
      </div>
    </div>
    {isInDetailsMode && (
      <div style={{ paddingTop: "4rem" }}>
        <WritableDetails
          value={habitInStream.find((el) => el.id === id)?._initial}
          onChange={value => inputDetailsChangeHandler("_initial", value)} />
      </div>
    )}
          </>
    }

    return (
      <Draggable isDragDisabled={isInDetailsMode} draggableId={id} index={index}>
        {(provided) => (
          <Resizable
            key={forcer}
            onResize={internalResizeHandler}
            onResizeStop={resizeEndHandler}
            width="100%"
            ref={mainContainerRef}
            className={`habitMainContainer ${isInDetailsMode ? "habitMainContainer--inDetailsMode" : ""}`}
            enable={{ bottom: !isInDetailsMode && index + hoursGoNext !== 24 ? true : false }}
            minHeight={100}
            maxHeight={!availableNextHours ? hoursGoNext * 100 : availableNextHours * 100 + hoursGoNext * 100}
            grid={[100, 100]}
            defaultSize={{ width: "100%", height: hoursGoNext * 100 }}
            maxWidth="100%"
            handleComponent={{bottom: currentItemInDeleteProcess !== id && <StreamResizeTrigger isInResizing={isInResizing === id} /> }} >
            {isDetailsOptionMenuOpen && (
              <DetailsOptionsMenu
                closeHandler={determineHandler}
                bgColor={color}
              />
            )}
            <div
              id={position}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`streamItem ${isInDragging ? "streamItem--hideResizeTrigger" : ""} ${detailsActive ? "streamItem--overflowHidden" : ""}`}>
              <div
                onClick={() => currentItemInDeleteProcess === id && cancelDeleteProcess()}
                className={`streamItem__container ${currentItemInDeleteProcess === id ? "streamItem__container--delete" : ""}`}
                style={{ backgroundColor: `#${color || "dcdcdc"}` }}>
                  {renderChecker()}
              </div>
            </div>
          </Resizable>
        )}
      </Draggable>
    );
  };



  export default StreamItem