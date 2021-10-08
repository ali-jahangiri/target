import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Resizable } from "re-resizable";
import { generateColor, selfClearTimeout } from "../../utils";


const optionsList = ["Completed" , "Half of it" , "Leave"]

const RoutineStream = ({ id , color , name , hour , index , habitInStream }) => {
    const [liftedTimeFromAboveBlocks, setLiftedTimeFromAboveBlocks] = useState(null);
    const [isOtherVisionVisible, setIsOtherVisionVisible] = useState(false);
    const [showSpendTimeResizable, setShowSpendTimeResizable] = useState(false);

    const routineTime = hour.to - hour.from;

    useEffect(function calcOverPushFromAboveBlock() {
        const validStream = habitInStream.filter(el => el.name);
        const targetStreamForSelectIndex = validStream.findIndex(el => el.id === id);
        const pureArrayBeforeCurrentSelectedStream = [...validStream].splice(0 , targetStreamForSelectIndex)
        const pushCountFromAboveBlocks = pureArrayBeforeCurrentSelectedStream.reduce((acc , res) => acc + res.hoursGoNext , 0) - pureArrayBeforeCurrentSelectedStream.length;
        setLiftedTimeFromAboveBlocks(pushCountFromAboveBlocks);
    }, [habitInStream, id, index, name]);


    const toggleOtherVisionHandler = () => {
        setIsOtherVisionVisible(prev => !prev);
        if(!isOtherVisionVisible !== false) {
            setShowSpendTimeResizable(true)
        }else {
            selfClearTimeout(() => {
                setShowSpendTimeResizable(false)
            } , 2500);
        }
    }

    const selectSuggestHourHandler = hour => {

    }

    return (
        <Draggable draggableId={id} index={index} isDragDisabled>
            {provided => (
                <div
                className="routineStream"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}>
                    <div style={{ backgroundColor : generateColor(`#${color}` , 8) , height : routineTime * 100 }}>
                        <Resizable
                                minWidth="100%"
                                maxHeight="100%"
                                defaultSize={{ height : "75%" }}
                                grid={[50 , 50]}
                                style={{ backgroundColor : `#${color}`}}
                                className={`routineStream__doneUnitResizable ${!isOtherVisionVisible ? "routineStream__doneUnitResizable--hide" : ""} ${showSpendTimeResizable ? "routineStream__doneUnitResizable--showUp" : ""}`}>
                                <div className="routineStream__donePreviewText">
                                    <div className="routineStream__donePreviewText__container">
                                        <p>How much you spend for this <span>Routine</span>?</p>
                                        <div className="routineStream__suggestHourContainer">
                                            {
                                                optionsList.map((el , i) => (
                                                    <div 
                                                        style={{ animationDelay : `${(i + 1) * 800}ms` }} 
                                                        onClick={selectSuggestHourHandler} key={i} 
                                                        className="routineStream__suggestItem">
                                                        <p>{el}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Resizable>
                        <div className="routineStream__name">
                            <p>{name}</p>
                        </div>
                        <div style={{ background : generateColor(`#${color}` , 9) }} className={`routineStream__helperFiller ${isOtherVisionVisible ? "routineStream__helperFiller--active" : ""}`}></div>
                        <div className={`routineStream__footer ${isOtherVisionVisible ? "routineStream__footer--otherVision" : ""}`}>
                            <div onClick={toggleOtherVisionHandler} className="routineStream__circle">
                                <div style={{ backgroundColor : `#${color}` }} />
                            </div>
                            <div className="routineStream__time">
                                <p>From <span>{hour.from + 1}</span> To <span>{hour.to + 1}</span></p>
                            </div>
                            {
                                !!liftedTimeFromAboveBlocks && <div className="routineStream__timeLiftAlert">
                                    <p>Delayed for <span>{liftedTimeFromAboveBlocks} hour{liftedTimeFromAboveBlocks > 1 && "s"}</span></p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}



export default RoutineStream;