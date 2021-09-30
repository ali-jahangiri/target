import React, { useEffect } from "react";
import { useState } from "react";
import client from "../client";
import WeekDay from "../components/AllWeekSchedule/WeekDay";
import WeekTimeline from "../components/AllWeekSchedule/WeekTimeline";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { findFilledStreamWeekDay, requests, selfClearTimeout } from "../utils";

const AllWeekSchedule = () => {
    const [habitPerWeek, setHabitPerWeek] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentDayName, setCurrentDayName] = useState(1);

    const [isInDaySwitchProcess, setIsInDaySwitchProcess] = useState(false)


    useEffect(() => {
        requests.habitPerWeek.getEntireSchedule(res => {
            setHabitPerWeek(res)
            setLoading(false)    
        });
    } , [])


    const daySwitchHandler = newPassedDayName => {
        setIsInDaySwitchProcess(true);
        selfClearTimeout(() => {
            setCurrentDayName(newPassedDayName)
            setIsInDaySwitchProcess(false);
        } , 300)
    }

    return <Loading loading={loading}>
        {isReady => isReady && (
            <div className="allWeekSchedule">
                {/* <Header>Week Schedule Summary</Header> */}
                <div className={`allWeekSchedule__flasher ${isInDaySwitchProcess ? "allWeekSchedule__flasher--visible" : ""}`} />
                {
                    client.STATIC.DAY_OF_WEEK.slice(currentDayName - 1 , currentDayName).map((el , i) => <WeekDay currentDayName={currentDayName} setCurrentDayName={daySwitchHandler} filedHabit={findFilledStreamWeekDay(el , habitPerWeek)} name={el} key={i}  />)
                }
            </div>
        )}
    </Loading>
}


export default AllWeekSchedule;