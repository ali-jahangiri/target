import { useEffect, useState } from "react";
import { requests } from "../utils";

const useFetcher = (targetRequest ,dependencyList = []) => {
    const [state, setState] = useState({ data : null , loading : true , error : null })

    useEffect(() => {
        setState(prev => ({ ...prev, loading : true }));
        targetRequest(requests)()
            .then(data => {
                setState(prev => ({ ...prev , data , loading : false , error : false }));
            })
    } , dependencyList);


    return { error : state.error , loading : state.loading , data : state.data }
}



export default useFetcher;