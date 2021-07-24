import Persian from "persian-date";
import { useLayoutEffect } from "react";
import { useRef } from "react";
import { selfClearTimeout } from "../utils";


import LoadingPage from "../Pages/LoadingPage";

import { FiArrowRight } from "react-icons/fi";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const Playground = () => {
    const now = new Persian();
    const allDays = new Array(now.add("month", 0).daysInMonth()).fill(1);
    const nthDayOfMonth = now.date();
    const containerRef = useRef()
    const currentLeftPosition = useRef((nthDayOfMonth - 1) * window.innerWidth)
    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(true);

    const scrollHandler = left => {
        containerRef.current?.scroll({ left , behavior : "smooth"})
    }

    useLayoutEffect(() => {
        selfClearTimeout(() => {
            containerRef.current?.scroll({ left : currentLeftPosition.current , behavior : "smooth" })
        } , 500)
        window.addEventListener("wheel" , e => {
            if(e.deltaY > 0 && currentLeftPosition.current < window.innerWidth * allDays.length) {  
                currentLeftPosition.current += window.innerWidth
                scrollHandler(currentLeftPosition.current)
            }else if(currentLeftPosition.current > 0) {
                currentLeftPosition.current -= window.innerWidth
                scrollHandler(currentLeftPosition.current)
            }
            
        })
    } , [containerRef])


    useEffect(() => {
        
    } , [])

    return !loading ? <LoadingPage /> : (
        <div ref={containerRef} style={{ display : "flex" }} className="mainContainer">
            {
                allDays.map((el , i) => (
                    <div key={i} className="__dayContainer">
                        <div className="innerContainer">
                            <p style={{ fontSize : "5rem" }}> {i + 1}</p>
                            <FiArrowRight />
                            <div>
                                {/* <img src={images[i]} alt="cover" /> */}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}



export default Playground;