import { useState } from "react";

const useKeyBaseState = (defaultState = {} ) => {
    const [valueStore, setValueStore] = useState(defaultState);

    const changeHandler = (key , value) => {
        if(typeof key === "object") return setValueStore(defaultState);
        else if(typeof key === "function") return setValueStore(key)
        setValueStore(prev => ({
            ...prev,
            [key] : value
        }))
    }

    return [valueStore , changeHandler]
}


export default useKeyBaseState;