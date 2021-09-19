import { useHistory } from "react-router";

const MenuItem = ({ path , name , onHover , color }) => {
    const history = useHistory();
    const redirectToPageHandler = () => history.push(path)

    return (
        <div onMouseLeave={() => onHover("3A6351")} onMouseEnter={() => onHover(color)} onClick={redirectToPageHandler} className="menuItem">
            <p>{name}</p>
        </div>
    )
}


export default MenuItem;