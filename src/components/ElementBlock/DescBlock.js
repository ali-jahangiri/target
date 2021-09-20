import TextareaAutosize from "react-textarea-autosize";

const DescBlock = ({ value }) => {
    return (
        <div className="descBlock">
            <div className="descBlock__container">
                <div className="descBlock__avatarBox" />
                <TextareaAutosize
                    readOnly
                    style={{ fontSize : "1.2rem" }} 
                    value={value} />
            </div>
        </div>
    )
}


export default DescBlock;