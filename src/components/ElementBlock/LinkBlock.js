import { Link } from "react-router-dom";
import LinkPlayground from "../ToolBoxPlayground/LinkPlayground";
import BlockWrapper from "./BlockWrapper";


const LinkBlock = ({ value : { linkPath , type } , isInEditMode , editContentHandler , removeContentHandler }) => {
    return (
        <BlockWrapper controllerVisible={isInEditMode} removeHandler={removeContentHandler}>
            {
                !isInEditMode && (
                type === "date" ? 
                    <Link style={{ color : "#C84B31" , fontSize : "2rem"}} to={`/?specific=${linkPath.split("/").join("")}`}>{linkPath}</Link> 
                    :
                    <a style={{ color : "#5F939A" , fontSize : "2rem"}} href={linkPath}>
                    {linkPath}
                </a>
                )
            }
        {
            isInEditMode && <LinkPlayground
                                liftValuesForFirstTime={false} 
                                inBlock 
                                value={{ linkPath , type  }} 
                                onChange={editContentHandler} />
        }
        </BlockWrapper>
        // <div className="linkBlock">
        //     {
        //         !isInEditMode && (
        //         type === "date" ? 
        //             <Link style={{ color : "#C84B31" }} to={`/?specific=${linkPath.split("/").join("")}`}>{linkPath}</Link> 
        //             :
        //             <a style={{ color : "#5F939A"}} href={linkPath}>
        //             {linkPath}
        //         </a>
        //         )
        //     }
        // {
        //     isInEditMode && <LinkPlayground 
        //                         liftValuesForFirstTime={false} 
        //                         inBlock 
        //                         value={{ linkPath , type  }} 
        //                         onChange={editContentHandler} />
        // }    
        //     <BlockController visible={isInEditMode} removeHandler={removeContentHandler} />
        // </div>
    )
}



export default LinkBlock;