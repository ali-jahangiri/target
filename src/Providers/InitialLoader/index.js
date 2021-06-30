import { useEffect, useState } from "react";
import { set } from "../../Store/slices/artWorkSlice";
import { useDispatch, useSelector } from "../../Store/Y-State";

import db from "../../firebase";

import useFetch, { useFetchDispatcher } from "../useFetch";
import { setUser } from "../../Store/slices/userSlice";

const client_id = "764ed27cabac1f5a2fc3";
const client_secret = "f33bec95761c696f667fdb06674fbc3f";


const InitialLoader = ({ children }) => {
    const api = useFetch();
    const [loading, setLoading] = useState(true);
    const fetchDispatcher = useFetchDispatcher()
    const dispatch = useDispatch();
    
    
    useEffect(() => {
        api.post("https://api.artsy.net/api/tokens/xapp_token", { client_id , client_secret })
            .then(({ data }) => {
                fetchDispatcher({ "X-XAPP-Token" : data.token })
                return data.token
            })
            .then(token => {
                return api.get("artworks" , { headers : { "X-XAPP-Token" : token } })
                    .then(({data}) => {
                        dispatch(() => set(data._embedded.artworks.map(el => el._links.image.href.replace("{image_version}" , 'larger'))))
                    })
            })
            .then(_ => {
                db.collection('user').onSnapshot(snapshot => {
                    const data = snapshot.docs.map(el => el.data()).pop();
                    dispatch(() => setUser(data))
                    setLoading(false)
                })
            })
        
    } , [])

    if(loading) {
        return <div>loading</div>
    }
    else {
        return children
    }
}


export default InitialLoader;