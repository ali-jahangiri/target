import { useHistory } from "react-router";

const TargetMindBord = () => {
    const history = useHistory();

    return (
        <div onClick={() => history.push("/mindBord")} style={{ background : "lightgrey" }} className="targetMoreOptionBox">
            <p>Have something about <span>targets</span> in your mind ?</p>
        </div>
    )
}

export default TargetMindBord;