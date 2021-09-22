const BlockController = ({ removeHandler , visible }) => {
    return (
        <div className={`blockController ${visible ? "blockController--visible" : ""}`}>
            <div className="blockController__removeTrigger">
                <p onClick={() => visible && removeHandler()}>Remove</p>
            </div>
        </div>
    )
}


export default BlockController;