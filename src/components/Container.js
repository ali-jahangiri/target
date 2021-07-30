const Container = ({ children , className , style }) => {
    return (
        <div style={style} className={`container ${className}`}>
            {children}
        </div>
    )
}


export default Container;