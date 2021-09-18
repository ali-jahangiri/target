import { useEffect } from "react";
import { useState } from "react";
import { ErrorPage } from "../../Pages";
import requests from "../../utils/requests";

const RequestProvider = ({ children }) => {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        requests.connectionObserver.connect(setStatus)
    } , [])

    if(Array.isArray(status) && !status.length) return <ErrorPage message="Cannot connect to server. Please check your internet connection or vpn" />
    else return children
}


export default RequestProvider;