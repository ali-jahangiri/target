import { Link } from "react-router-dom";

const LinkBlock = ({ value : { linkPath , type } }) => {
    return (
        <div className="linkBlock">
            {
                type === "date" ? 
                    <Link style={{ color : "#C84B31" }} to={`/?specific=${linkPath.split("/").join("")}`}>{linkPath}</Link> 
                    :
                    <a style={{ color : "#5F939A"}} href={linkPath}>
                    {linkPath}
                </a>
            }
        </div>
    )
}



export default LinkBlock;