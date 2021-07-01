const Btn = ({ onClick , children , style , type = "button" }) => {
    return (
        <button type={type} onClick={onClick} style={style} className="btn">
            {children}
        </button>
    )
}


export default Btn;