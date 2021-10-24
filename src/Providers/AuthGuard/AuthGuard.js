import { useEffect, useState } from "react";
import { firebaseAuth } from "../../firebase";
import { Login } from "../../Pages";


const AuthGuard = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        firebaseAuth.onAuthStateChanged(authState => {
            setLoading(false);
            setIsLoggedIn(authState);
        })
    } , []);

    if(loading) return <div style={{
        width: "100vw",
        height: "100vh",
        background : "black",

    }} />
    else if(!loading && isLoggedIn) return children
    else return <Login />

}


export default AuthGuard;