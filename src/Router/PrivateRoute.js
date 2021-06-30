import { Redirect } from "react-router";
import { useSelector } from "../Store/Y-State";

const PrivateRoute = ({ children }) => {
    const isAuth = useSelector(state => state.user);
    return isAuth ? children : <Redirect to="/setup" />
}


export default PrivateRoute;