const DeleteStreamItem = ({ clickHandler }) => {
    return (
        <div className="deleteStreamItem">
            <p onClick={clickHandler}>Delete</p>
        </div>
    )
}


export default DeleteStreamItem;