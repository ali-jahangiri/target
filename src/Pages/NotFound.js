import Btn from "../components/Btn"

const NotFound = ({ history }) => {
    const comebackHomeHandler = () => 
        history.push('/');  
    return (
        <div className="notFound">
            <p>there is no page with this path , Are you lost ? </p>
            <Btn onClick={comebackHomeHandler} style={{ color : "white" , marginLeft : 20 }}>
                Comeback Home
            </Btn>
        </div>
    )
}   


export default NotFound;