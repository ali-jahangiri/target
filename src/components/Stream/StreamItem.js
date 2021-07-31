import { useRef , useEffect , useState} from "react";
import { Resizable } from "re-resizable";
import { Draggable } from "react-beautiful-dnd";
import { CgClose } from "react-icons/cg";
import { FiCheck, FiMoreHorizontal } from "react-icons/fi";
import { selfClearTimeout } from "../../utils";

import DetailsOptionsMenu from "../DetailsOptionMenu";
import StreamResizeTrigger from "./StreamResizeTrigger";


const WritableDetails = ({
    value,
    onChange,
    placeholder = "write and save your idea about this habit...",
  }) => {
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
  
  const StreamItem = ({ detailsShowHandler, id, sidebarClosedByUser, index, setIsSidebarOpen, color, habitName, resizeHandler, hoursGoNext, setNthChildHandler, isInDragging, isInResizing, isInDetailsMode, setHabitInStream, habitInStream, }) => {
    const [internalH, setInternalH] = useState(0);
    const [isDetailsOptionMenuOpen, setIsDetailsOptionMenuOpen] = useState(false);
      
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
  
    let availableNextHours = 24 - (index + hoursGoNext);
    const _initialWasSettled = !!habitInStream.find((el) => el.id === id)?._initial;
    
    const refContainer = useRef();
  
    const showDetailsHandler = () => {
      const validStream = habitInStream.filter(el => el.name);
      const targetStreamForSelectIndex = validStream.findIndex(el => el.name === habitName);
      const pureArrayBeforeCurrentSelectedStream = [...validStream].splice(0 , targetStreamForSelectIndex)
      const hh = pureArrayBeforeCurrentSelectedStream.reduce((acc , res) => acc + res.hoursGoNext , 0) - pureArrayBeforeCurrentSelectedStream.length;

      document.getElementsByClassName('mainContainer')[0]
        .scroll({ top : (index + hh) * 100 , behavior : "smooth" })

      let start = index + hh;
      const end = start + hoursGoNext;
      
      const possibleStep = new Array(end - start).fill("").map((_) => ++start);

      if (isInDetailsMode) setIsDetailsOptionMenuOpen((prev) => !prev);
      else detailsShowHandler(id , possibleStep);
    };
  
    return (
      <Draggable isDragDisabled={isInDetailsMode} draggableId={id} index={index}>
        {(provided) => (
          <Resizable
            ref={refContainer}
            onResize={internalResizeHandler}
            onResizeStop={resizeEndHandler}
            className={`habitMainContainer ${isInDetailsMode ? "habitMainContainer--inDetailsMode" : ""}`}
            enable={{ bottom: !isInDetailsMode && index + hoursGoNext !== 24 ? true : false }}
            minHeight={100}
            maxHeight={!availableNextHours ? hoursGoNext * 100 : availableNextHours * 100 + hoursGoNext * 100}
            grid={[100, 100]}
            defaultSize={{ width: "100%", height: hoursGoNext * 100 }}
            handleComponent={{bottom: <StreamResizeTrigger isInResizing={isInResizing === id} /> }} >
            {isDetailsOptionMenuOpen && (
              <DetailsOptionsMenu
                closeHandler={setIsDetailsOptionMenuOpen}
                bgColor={color}
              />
            )}
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`streamItem ${isInDragging ? "streamItem--hideResizeTrigger" : ""}`}>
              <div
                className="streamItem__container"
                style={{ backgroundColor: `#${color || "dcdcdc"}` }}>
                <div className={`streamItem__innerContainer ${isInDetailsMode ? "streamItem__innerContainer--setUp" : ""}`} >
                  <p>{habitName}</p>
                  <div className="streamItem__detailsModeCtaContainer">
                    <div
                      onClick={showDetailsHandler}
                      className={`streamItem__detailsTrigger ${isInDetailsMode? "streamItem__detailsTrigger--rotate": ""}`} >
                      <FiMoreHorizontal />
                    </div>
                    <div onClick={() => showDetailsHandler(false)} className={`determiner ${isInDetailsMode ? "determiner--active" : ""}`} >
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
              </div>
            </div>
          </Resizable>
        )}
      </Draggable>
    );
  };



  export default StreamItem