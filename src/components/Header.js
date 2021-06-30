import { useSelector } from "../Store/Y-State";

const Header = ({ children }) => {  
    const image = useSelector(state => state.artwork)
    console.log(image);
    return (
        <div className="pageHeader">
            <p className="pageHeader__title">{children}</p>
        </div>
    )
}

export default Header;