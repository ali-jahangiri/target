const StreamLoading = ({ children , loading }) => {

    const renderChild = children(!loading)

    return (
        <>
            <div className={`streamLoading ${!loading ? "streamLoading--hide" : ""}`}>
                <p>*</p>
            </div>
            {renderChild || <div className="streamLoafing__before" /> }
        </>
    )
}



export default StreamLoading;