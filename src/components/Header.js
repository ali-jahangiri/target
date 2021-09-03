const Header = ({ children }) => {  
    return (
        <div className="pageHeader">
            <div className="pageHeader__container">
                <p className="pageHeader__title">{children}</p>
            </div>
        </div>
    )
}

export default Header;