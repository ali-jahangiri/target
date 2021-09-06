import { useHistory } from "react-router";

const TargetCreateNewOne = () => {
    const history = useHistory();

    const clickHandler = () => history.push("/newTarget");
    return (
        <div onClick={clickHandler} className="TargetCreateNewOne">
            <p>Have new Idea ? Let's bring in on as a <span>Target</span></p>
        </div>
    )
}


export default TargetCreateNewOne;