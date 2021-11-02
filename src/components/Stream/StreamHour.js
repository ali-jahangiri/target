import { addZeroToAboveTenNumber } from "../../utils";

const StreamHour = () => {
    return new Array(24).fill("")
                .map((_, i) => <div key={i} className="streamHour">{addZeroToAboveTenNumber(i + 1)}</div>)
}

export default StreamHour;