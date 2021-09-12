import { useEffect, useState } from "react";
import { getRandomItem } from "../utils";

const useFrequentlyState = (list, delay = 100 , inOrder) => {
    const [currentText, setCurrentText] = useState("")

    useEffect(() => {
        let index = 0;
        let timer = setInterval(() => {

            if(inOrder) {
                if(index < list.length) {
                    setCurrentText(prev => `${prev} ${list[index]}`);
                    index++;
                }
            }else {
                setCurrentText(getRandomItem(list))
            }
        } , delay);
        return () => {
            clearInterval(timer);
        }
    } , [])


    return currentText;
}



export default useFrequentlyState;