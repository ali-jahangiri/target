import { useState } from "react";
import { Resizable } from "re-resizable";
import { debounce, selfClearTimeout } from "../../utils";
import StreamResizeTrigger from "./StreamResizeTrigger";

const optionsList = ["Completed" , "Half of it" , "Leave"];
const optionsHeight = {
    Completed : 100 , 
    "Half of it" : 50 ,
    Leave : 25
}

const RoutineStreamSpendTime = ({ 
    setIsInResizing , 
    internalSpendTime , 
    setInternalSpendTime , 
    isOtherVisionVisible , 
    routineTime,
    color,
    spendTime ,
    showSpend,
    showSpendTimeResizable
}) => {

    const [currentActiveSuggest, setCurrentActiveSuggest] = useState(null);
    const [showSuggestContainer, setShowSuggestContainer] = useState(true);
    const [hasTouchOnManualResize, setHasTouchOnManualResize] = useState(false);
    const [removeSuggestHour, setRemoveSuggestHour] = useState(false);


    const selectSuggestHourHandler = hour => {
        if(hour !== currentActiveSuggest) {
            setCurrentActiveSuggest(hour);
            selfClearTimeout(() => {
                setInternalSpendTime(optionsHeight[hour]);
            } , 1000);
            
            selfClearTimeout(() => {
                setShowSuggestContainer(false);
            } , 500)
        }
    }

    const onResizeStartHandler = () => {
        setHasTouchOnManualResize(true);
        setIsInResizing(true);
        selfClearTimeout(() => {
            setRemoveSuggestHour(true);
        } , 350)
    }

    const onResizeEndHandler = () => {
        setIsInResizing(false);
    }
    
    
    const onResizeHandler = debounce((e , dir , resRef) => {
        const roundedReceivedNumber = Math.ceil(Math.round(resRef.clientHeight / 50) * 50);
        const percentOfFilled = Math.ceil((roundedReceivedNumber / routineTime));
        setInternalSpendTime(percentOfFilled);
    } , 15);


    const userDontSetSpentTimeYet = internalSpendTime === -1;
    const getFullSpendTime = internalSpendTime === 100;
    const almostLeaveSpendTime = internalSpendTime < 10;


    return (
        <Resizable
            minWidth="100%"
            minHeight={showSpend ? 50 : 0}
            size={{ height : isOtherVisionVisible ? (userDontSetSpentTimeYet ? "50%" : `${internalSpendTime}%`) : 0 }}
            maxHeight="100%"
            defaultSize={{ height : "75%" }}
            enable={{ bottom : true }}
            handleComponent={{ bottom : <StreamResizeTrigger /> }}
            grid={[50 , 50]}
            onResizeStart={onResizeStartHandler}
            onResizeStop={onResizeEndHandler}
            onResize={onResizeHandler}
            style={{ backgroundColor : `#${color}`}}
            className={`routineStream__doneUnitResizable ${!showSpend ? "routineStream__doneUnitResizable--hide" : ""} ${showSpendTimeResizable ? "routineStream__doneUnitResizable--showUp" : ""}`}>
            {
                spendTime === -1 && !removeSuggestHour && spendTime  && <div className={`routineStream__donePreviewText ${hasTouchOnManualResize ? "routineStream__donePreviewText--getHide" : ""}`}>
                    <div className="routineStream__donePreviewText__container">
                        <div style={{ display : "flex" }}>
                            <p>How much you spend for this <span>Routine</span>?</p>
                            {
                                currentActiveSuggest && <div
                                    key={currentActiveSuggest}
                                    className={`routineStream__currentSelectedSuggest ${currentActiveSuggest ? "routineStream__currentSelectedSuggest--haveValue" : ""}`}
                                    onClick={() => setShowSuggestContainer(prev => !prev)} >
                                    {currentActiveSuggest}
                            </div>
                            }
                        </div>
                        <div className={`routineStream__suggestHourContainer ${!showSuggestContainer ? "routineStream__suggestHourContainer--getHide" : ""}`}>
                            {
                                showSpendTimeResizable && optionsList.map((el , i) => (
                                    <div
                                        style={{ animationDelay : `${(i + 1) * 650}ms`}} 
                                        onClick={() => selectSuggestHourHandler(el)} key={i} 
                                        className={`routineStream__suggestItem ${currentActiveSuggest === el ? "routineStream__suggestItem--active" : ""}`}>
                                        <p>{el}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            }
            <div className={`routineStream__spendHourPercent ${hasTouchOnManualResize || !userDontSetSpentTimeYet ? "routineStream__spendHourPercent--show" : ""}`}>
                <p style={{ opacity : (getFullSpendTime || almostLeaveSpendTime) ? 0 : 1 }}>{userDontSetSpentTimeYet ? "50%" : `${internalSpendTime}%`}</p>
                <p className={`routineStream__spendHourPercent__helperText ${(getFullSpendTime || almostLeaveSpendTime) ? "routineStream__spendHourPercent__helperText--active" : ""}`}>
                    {
                        getFullSpendTime ? "Done !" : "Leave"
                    }
                </p>
            </div>
        </Resizable>
    )
}


export default RoutineStreamSpendTime;