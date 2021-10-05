import { useEffect, useRef } from "react";

const useAfterInitialEffect = (callback , dependencyList = []) => {
    const isInInitial = useRef(true);

    useEffect(() => {
        if(!isInInitial.current) {
            callback()
        }else isInInitial.current = false
    } , dependencyList)
}


export default useAfterInitialEffect;