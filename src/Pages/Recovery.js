import { useEffect, useRef } from "react";
import { requests } from "../utils";

const Recovery = () => {
    const linkRef = useRef();
    
    useEffect(() => {
        requests.recovery.entire()
            .then(data => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
                linkRef.current.setAttribute("href" , dataStr);
                linkRef.current.setAttribute("download", `recover(${Date.now()}).json`);
                linkRef.current.click();
            })
    } , []);


    return (
        <div>
            <a ref={linkRef} />
        </div>
    )
    
}

export default Recovery;