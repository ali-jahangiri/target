import RoutineTimeSelector from "./RoutineTimeSelector"

const RoutineCreator = (props) => {
    return (
        <div style={{ padding : 10 , height : "auto" , widows : "100%" }}>
            <RoutineTimeSelector {...props} />
        </div>
    )
}


export default RoutineCreator;