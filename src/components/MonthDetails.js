import Persian from "persian-date";

import { FiRefreshCcw } from "react-icons/fi"

const MonthDetails = ({ resetHandler , currentMonth , isActive }) => {
    const now = new Persian();

    return (
        <div className={`monthDetails ${isActive ? "monthDetails--active" : ""}`}>
            <div onClick={() => resetHandler(0)}>
                <FiRefreshCcw />
            </div>
            <p>{now.add('month' , currentMonth).format('MMMM')}</p>
        </div>
    )
}


export default MonthDetails;