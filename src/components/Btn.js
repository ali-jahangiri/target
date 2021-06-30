const Btn = ({ onClick , children , style }) => {
    return (
        <div onClick={onClick} style={style} className="btn">
            {children}
        </div>
    )
}


export default Btn;