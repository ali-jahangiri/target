import useFrequentlyState from "../Hook/useFrequentlyState"
import { colors, generateColor } from "../utils"
import { LinkPlayground, TextPlayground } from "./ToolBoxPlayground";
import DescriptionPlayground from "./ToolBoxPlayground/DescriptionPlayground";
import ImagePlayground from "./ToolBoxPlayground/ImagePlayground";



const Image = () => {
    const currentImage = useFrequentlyState(colors , 250);

    return (
        <div style={{ backgroundColor : `#${currentImage}` , width : "100%" , height : "100%" , zIndex : -1}} className="toolBox__conceptContainer">
        </div>
    )
}


const textList = ["HOOR" , "-*" , "Enter" , "Man+" , "GET_" , "PiCKKKK" , "NWW" , "beatae-est-illum " , "Debitis architecto ut E.."]
const Text = () => {
    const currentText = useFrequentlyState(textList)
    return (
        <div className='toolBox__conceptContainer'>
            <p>{currentText}</p>
        </div>
    )
}

const descList = "Hi there ! this is my desc about ...".split(" ")
const Description = () => {
    const currentSentence = useFrequentlyState(descList , 200 , true);
    return (
        <div className='toolBox__conceptContainer'>
            <p>{currentSentence}</p>
        </div>
    )
}

const linkList = ["@","@","@" ,"@","@","@","@","@","@"];
const Link = () => {
    const currentText = useFrequentlyState(linkList , undefined , true)
    return (
        <div className='toolBox__conceptContainer'>
            <p>{currentText}</p>
        </div>
    )
}


const voiceList = new Array(50).fill("").map((_ , i) => (i + 1) * 1.5)

const Voice  = () => {
    const currentSize = useFrequentlyState(voiceList);

    return (
        <div className='toolBox__conceptContainer'>
            <div style={{ width : currentSize , height : currentSize , backgroundColor : '#ffffff7a' , position : "absolute" , opacity : Number(currentSize / 100)}} />
        </div>
    )
}

const renderToolBoxConceptEffect = {
    text : <Text />,
    image : <Image />,
    description : <Description />,
    link : <Link />,
    voice : <Voice />
}

const renderToolBoxPlayground = ({ core , setCore , ...rest }) => ({
    link : <LinkPlayground {...rest} />,
    text : <TextPlayground value={core?.text} onChange={value => setCore("text", value)} {...rest} />,
    image : <ImagePlayground {...rest} />,
    description : <DescriptionPlayground {...rest} />
})

const ToolBox = ({ name , bgColor , index , setCurrentToolBox , currentToolBox , isInCloseProcess , core , setCore }) => {
    const isActive = currentToolBox === name;
    
    return (
        <div
            onClick={() => setCurrentToolBox(name)}
            style={{ background : isActive ? `linear-gradient(180deg, ${generateColor(`#${bgColor}` , 5)}, transparent)` : `#${bgColor}` , animationDelay : `${(isInCloseProcess ? index / 2 : index) * 100}ms` }} 
            className={`toolBox ${currentToolBox ? isActive ? "toolBox--active" : "toolBox--deActive" : ""} ${isInCloseProcess ? "toolBox--getHide" : ""}`}>
            <span style={{ backgroundColor : `#${bgColor}` , transitionDelay : isActive ? ".3s" : "0s" }} className="toolBox__growLine" />
            {
                !isActive ? <div className="toolBox__directory">{renderToolBoxConceptEffect[name] }</div>: renderToolBoxPlayground({
                    core,
                    setCore
                })[name]
            }
            <p style={{ color: isActive ? `#${bgColor}` : "black" , transitionDelay : currentToolBox ? ".3s" : "0s"}} className="toolBox__title">{name} {isActive && ":"}</p>
        </div>
    )
}


export default ToolBox;