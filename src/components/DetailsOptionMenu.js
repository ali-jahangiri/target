import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { selfClearTimeout } from "../utils";

const DetailsOptionsMenu = ({ closeHandler, bgColor }) => {
  const [isInClosing, setIsInClosing] = useState(false);

  const internalCloseHandler = () => {
    setIsInClosing(true);
    selfClearTimeout(() => {
      closeHandler((prev) => !prev);
      setIsInClosing(false);
    }, 200);
  };

  return (
    <div
      style={{ background: `#${bgColor || "dcdcdc"}` }}
      className={`detailsOptionMenu ${
        isInClosing ? "detailsOptionMenu--closing" : ""
      }`}
    >
      <div className="detailsOptionMenu__back">
        <div onClick={internalCloseHandler}>
          <FiArrowRight />
        </div>
      </div>
    </div>
  );
};

export default DetailsOptionsMenu;
