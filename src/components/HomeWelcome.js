import { useEffect, useState } from "react";
import { selfClearTimeout } from "../utils";

const HomeWelcome = () => {
    const [isInDestroyProcess, setIsInDestroyProcess] = useState(false);
    const [shouldGetDestroy, setShouldGetDestroy] = useState(false);
    
    useEffect(() => {
        selfClearTimeout(() => setIsInDestroyProcess(true) , 1900);

        selfClearTimeout(() => {
            setIsInDestroyProcess(false);
            setShouldGetDestroy(true);
        } , 3900);
    } , [])

    if(!shouldGetDestroy) {
        return <div className={`welcomeLoading ${isInDestroyProcess ? "welcomeLoading--destroy" : ""}`}>
                <div className="welcomeLoading__container">
                    <p>Welcome</p>
                </div>
            </div>
    }
    else return null;
}



export default HomeWelcome;