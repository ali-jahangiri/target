import Btn from "../components/Btn";

const ErrorPage = ({ message }) => {   
    const resetAppHandler = () => {
        window.location.reload()
    }
    return (
        <div className="errorPage">
            <div className="errorPage__container">
                <p>Something went wrong . check your internet connection and try again</p>
                <p>Message <span className="errorPage__message">{message}</span></p>
                <Btn style={{ color : "white" , marginTop : 20}} onClick={resetAppHandler}>
                    Reset App
                </Btn>
            </div>
        </div>
    )
}


export default ErrorPage;