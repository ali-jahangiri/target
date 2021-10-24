import React, { useEffect } from "react";
import { useState } from "react";
import client from "../client";
import WeekDay from "../components/AllWeekSchedule/WeekDay";
import Menu from "../components/Menu";
import { findFilledStreamWeekDay, requests, selfClearTimeout } from "../utils";

const AllWeekSchedule = () => {
    const [habitPerWeek, setHabitPerWeek] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentDayName, setCurrentDayName] = useState(1);
    const [isInDaySwitchProcess, setIsInDaySwitchProcess] = useState(false);



    useEffect(() => {
        requests.habitPerWeek.getEntireSchedule(res => {
            setHabitPerWeek(res);
            setLoading(false);
        });
    } , []);


    const daySwitchHandler = newPassedDayName => {
        setIsInDaySwitchProcess(true);
        selfClearTimeout(() => {
            setCurrentDayName(newPassedDayName)
            setIsInDaySwitchProcess(false);
        } , 300)
    }

    return <Menu loading={loading}>
        {isReady => isReady && (
            <div className="allWeekSchedule">
                <div className={`allWeekSchedule__flasher ${isInDaySwitchProcess ? "allWeekSchedule__flasher--visible" : ""}`} />
                {
                    client.STATIC.DAY_OF_WEEK.slice(currentDayName - 1 , currentDayName).map((el , i) => <WeekDay 
                        currentDayName={currentDayName} 
                        setCurrentDayName={daySwitchHandler} 
                        filedHabit={findFilledStreamWeekDay(el , habitPerWeek)} 
                        name={el} 
                        key={i}  />)
                }
            </div>
        )}
    </Menu>
}


export default AllWeekSchedule;