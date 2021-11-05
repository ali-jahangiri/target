import { useLayoutEffect, useState } from "react";
import { selfClearTimeout } from "../../utils";

const StreamDetails = ({
    style ,
    color,
    name , 
}) => {
    const [uiGetCompleteInPlace, setUiGetCompleteInPlace] = useState(false);

    useLayoutEffect(() => {
        selfClearTimeout(() => {
            setUiGetCompleteInPlace(true);
        } , 700)
    } , [])

    return (
        <div className={`streamDetails ${uiGetCompleteInPlace ? "streamDetails--complete" : ""}`} style={{ width : style.width , height : style.height , left : style.left , top : style.top}}>
            <div style={{ background : `#${color}` , boxShadow : `0px 232px 320px 20px #${color}` }} className="streamDetails__container">
                <div className="streamDetails__basic">
                    <p>{name}</p>
                </div>
            </div>
            <div>
                Rerum magnam eaque reprehenderit blanditiis neque. Laborum et quia autem voluptatum fugit eius porro exercitationem et. Id aperiam consequuntur ad omnis est perferendis. Voluptatem dolore nulla sint ut omnis qui esse quia. Voluptatibus sunt aut fuga. Atque qui architecto qui voluptatum quo adipisci ex.
 
Voluptates quia ut. Accusamus mollitia ab doloremque alias sint nulla atque ex. Eos voluptas quis nostrum sit architecto.
 
Impedit illo aliquam aut ut. Impedit quibusdam vel repudiandae voluptatum eveniet. Porro eligendi est quae est vero occaecati ut.
            </div>
        </div>
    )
}



export default StreamDetails;