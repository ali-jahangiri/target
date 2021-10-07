import { useEffect, useState } from "react";
import { selfClearTimeout } from "../utils";

const WelcomeLoading = ({ isInLoading }) => {
    const [isInDestroyProcess, setIsInDestroyProcess] = useState(false);
    const [shouldGetDestroy, setShouldGetDestroy] = useState(false);

    useEffect(() => {
        if(!isInLoading) {
            setIsInDestroyProcess(true);
            selfClearTimeout(() => {
                setIsInDestroyProcess(false);
                setShouldGetDestroy(true)
            } , 2000)
        }
    } , [isInLoading])

    if(!shouldGetDestroy) {
        return <div className={`welcomeLoading ${isInDestroyProcess ? "welcomeLoading--destroy" : ""}`}>
                <div className="welcomeLoading__container">
                    <p>Welcome</p>
                </div>
            </div>
    }
    else return null;
}



export default WelcomeLoading;