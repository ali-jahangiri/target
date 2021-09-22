import { useLayoutEffect } from "react";
import { useState } from "react";
import { selfClearTimeout } from "../../utils";
import BlockController from "./BlockController";

const BlockWrapper = ({ children , controllerVisible , removeHandler }) => {
    const [fullyGetPlace, setFullyGetPlace] = useState(false);
    const [isInRemovingProcess, setIsInRemovingProcess] = useState(false);

    
    
    const internalRemoveHandler = () => {
        setIsInRemovingProcess(true);
        selfClearTimeout(() => {
            setIsInRemovingProcess(false);
            removeHandler();
        } , 700);
    }


    useLayoutEffect(() => {
        // selfClearTimeout(() => {
        //     setFullyGetPlace(true);
        // } , 500);
    } , []);

    return (
        <div className={`blockWrapper ${fullyGetPlace ? "blockWrapper--full" : ""} ${isInRemovingProcess ? "blockWrapper--remove" : ""}`}>
            {children}
            <BlockController visible={controllerVisible} removeHandler={internalRemoveHandler} />
        </div>
    )
}


export default BlockWrapper;