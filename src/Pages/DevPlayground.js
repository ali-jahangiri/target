import { useEffect } from "react";
import { requests } from "../utils";

const DevPlayground = () => {
  useEffect(() => {
    requests.routine.getRoutineList('شنبه' , res => {
      console.log(res);
    })
  } , []) 
  return (
    <div>
      111
    </div>
  )
}


export default DevPlayground;