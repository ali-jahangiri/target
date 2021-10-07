import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { generateColor } from "../../utils";

const RoutineStream = ({ id , color , name , hour , index , habitInStream }) => {
    const [liftedTimeFromAboveBlocks, setLiftedTimeFromAboveBlocks] = useState(null);

    const routineTime = hour.to - hour.from;

    useEffect(function calculateAvailableNextHr() {
        const validStream = habitInStream.filter(el => el.name);
        const targetStreamForSelectIndex = validStream.findIndex(el => el.id === id);
        const pureArrayBeforeCurrentSelectedStream = [...validStream].splice(0 , targetStreamForSelectIndex)
        const pushCountFromAboveBlocks = pureArrayBeforeCurrentSelectedStream.reduce((acc , res) => acc + res.hoursGoNext , 0) - pureArrayBeforeCurrentSelectedStream.length;
        setLiftedTimeFromAboveBlocks(pushCountFromAboveBlocks);
      }, [habitInStream, id, index, name])

    return (
        <Draggable draggableId={id} index={index} isDragDisabled>
            {provided => (
                <div
                className="routineStream"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}>
                    <div onClick={() => console.log('s')} style={{ backgroundColor : generateColor(`#${color}` , 8) , height : routineTime * 100 }}>
                        <div className="routineStream__name">
                            <p>{name}</p>
                        </div>
                        <div className="routineStream__footer">
                            <div className="routineStream__circle">
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