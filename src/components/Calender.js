import persian from "persian-date";
import { useState } from "react";

import { useHistory } from "react-router";
import CalenderController from "./CalenderController";
import MonthDetails from "./MonthDetails";

import { fixNumbers } from '../utils'
import client from "../client";


const Calender = () => {
  const now = new persian();
  const history = useHistory();

  const [currentMonth, setCurrentMonth] = useState(0);
  const nthDayOfWeek = now.local("fa").day();
  const nthDayOfMonth = now.date();

  const startDayOfMonthForEmptiness = Array(
    now.add("month", currentMonth).startOf("month").day() - 1
  ).fill("");

  const allDays = new Array(now.add("month", currentMonth).daysInMonth()).fill(1);

  const daySelectHandler = (dayNumber) => {
    history.push(fixNumbers(now.format(`YYYY-${currentMonth + 1}-${dayNumber}`)))
  };

  return (
    <div className="container-fluid schedule">
      <div className="row">
        <div className="w-100">
          <CalenderController monthSetter={setCurrentMonth} />
          <div className="schedule__dayOfWeek row flex-row-reverse">
            <MonthDetails isActive={!!currentMonth} currentMonth={currentMonth} resetHandler={setCurrentMonth} />
            {client.STATIC.DAY_OF_WEEK.map((el, i) => (
              <div key={i} className="schedule__dayOfWeek__item">
                {el}
              </div>
            ))}
          </div>
        </div>
        {startDayOfMonthForEmptiness.map((_, i) => (
          <div key={i} className="schedule__day schedule__day--empty"></div>
        ))}
        {allDays.map((_, i) => (
          <div className={`schedule__day ${nthDayOfMonth === i + 1 && !currentMonth ? "schedule__day--today" : ""}`} key={i}>
            <div
              onClick={() => daySelectHandler(i + 1)}
              className="schedule__day__container">
              <p>{i + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calender;
