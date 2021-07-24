import { FiChevronRight , FiChevronLeft } from "react-icons/fi";

const CalenderController = ({ monthSetter }) => (
    <>
        <div
          className="calender__controller"
          onClick={() => monthSetter((prev) => ++prev)} >
          <div className="calender__controller__overlay"></div>
          <FiChevronLeft color="lightgrey" />
        </div>
        <div
          className="calender__controller"
          onClick={() => monthSetter((prev) => --prev)}
        >
          <div className="calender__controller__overlay"></div>
          <FiChevronRight color="lightgrey" />
        </div>
    </>
)

export default CalenderController;