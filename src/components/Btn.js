const Btn = ({ onClick , children , style , type = "button" , disable }) => {
    return (
        <button disabled={disable} type={type} onClick={onClick} style={style} className="btn">
            {children}
        </button>
    )
}


export default Btn;