import client from "../client";
import { singInWithGoogle } from "../firebase/firebase";

const Login = () => {        
    const singInWithGoogleHandler = () => singInWithGoogle();

    return (
        <div className="login">
            <div className="login__form">
                <div className="login__header">
                    <p>Target</p>
                </div>
                <div className="login__welcome">
                    <p>{client.STATIC.loginWelcome}</p>
                </div>
                <div className="login__googleSignIn">
                    <button onClick={singInWithGoogleHandler}>
                        Sing in With Google
                    </button>
                </div>
            </div>
            <div className="login__intro">
                <p>{client.STATIC.slogan}</p>
            </div>
        </div>
    )
}


export default Login;