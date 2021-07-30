  
import React, { createContext, useState } from 'react';
import { useEffect } from 'react';

import Loading from '../../Pages/LoadingPage'

export const Store = createContext({
    store : {},
    setStore : ({ type , payload }) => {}
});

const StoreProvider = ({ children , store , logger = false , persistorEnabled , whiteSlice = [] }) => {
    const [loading, setLoading] = useState(true)
    if(!store) throw new Error("Please pass your store to Provider!");
    const [_store, set_Store] = useState(() => store.value);

    const persistOnChange = (sliceName , newValue) => {
        if(persistorEnabled && whiteSlice.includes(sliceName)) {
            localStorage.setItem(sliceName , JSON.stringify(newValue))
        }
    }


    const changeStore = ({ valueMaker , sliceName , payload , ...other }) => {
        set_Store(prev => ({
            ...prev,
            [sliceName] : valueMaker(prev[sliceName] , payload)
        }));
        persistOnChange(sliceName , valueMaker(_store[sliceName] , payload))
        console.log(`Action => ${other.type} - inside ' ${sliceName} ' slice` , _store);
        // console.groupCollapsed('Dispatching')
        // console.log(`Action => ${other.type} - inside ' ${sliceName} ' slice`);
        // console.groupEnd("end")
    }

    useEffect(() => {
        if(persistorEnabled) {
            Object.entries(_store)
            .map(([key]) => set_Store(prev => ({ ...prev ,  [key] : JSON.parse(localStorage.getItem(key)) || _store[key] })))
            setLoading(false)
        }
    } , [])

    // useEffect((0))

    return (
        <Store.Provider value={{ store : _store , setStore : changeStore }}>
            {
                loading ? null : children
            }
        </Store.Provider>
    )
}

export default StoreProvider;