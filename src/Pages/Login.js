import useKeyBaseState from "../Hook/useKeyBaseState";
import { singInWithGoogle , singInWithEmail } from "../firebase/firebase";
import { useState } from "react";

const googleIconColors = ["#ea4335" , "#fbbc05" , "#34a853" , "#4285f4" , "#cf412f" , "#fbbc05"];



const Login = () => {
    const [inputValue , setInputValue] = useKeyBaseState();
    const [haveSomeError, setHaveSomeError] = useState(null)

    const loginHandler = () => {
        singInWithEmail({ email : inputValue.username , password : inputValue.password })
            .then(res => {
                if(res.user) {
                    console.log(res , "**");
                }
            }).catch(err => setHaveSomeError(err.message))
    }
        
    const singInWithGoogleHandler = async () => {
        const result = await singInWithGoogle();
    }

    const inputValueChangeHandler = (key , value) => {
        setInputValue(key , value);
        if(haveSomeError) setHaveSomeError(null);
    }

    return (
        <div className="login">
            <div className="login__mainSection">
                <div className="login__form">
                    <div className="login__header">
                        <p>Hi There ! </p>
                    </div>
                    {/* <Input
                        showLabel
                        mode="dark" 
                        placeholder="User Name" 
                        labelStyle={{ fontSize : "1rem" }}
                        style={{ margin : ".5rem 0" }}
                        value={inputValue?.username || ""} 
                        onChange={value => inputValueChangeHandler("username" , value)} />
                    <Input
                        style={{ margin : ".5rem 0" }}
                        showLabel
                        mode="dark" 
                        placeholder="Password" 
                        type="password"
                        labelStyle={{ fontSize : "1rem" }}
                        value={inputValue?.password || ""} 
                        onChange={value => inputValueChangeHandler('password' , value)} />
                    {
                        haveSomeError && <div className="login__errorBox">
                            <p>{haveSomeError}</p>
                        </div>
                    }
                    <Btn disable={!inputValue?.password || !inputValue?.username} style={{ marginTop : "2rem" , width : "100%" , color : "white" }} onClick={loginHandler}>
                        Click for sing in
                    </Btn> */}
                    <div className="login__googleSignIn">
                        <button onClick={singInWithGoogleHandler}>
                            <p>Sing in With {"Google".split("").map((el , i) => <span key={i} style={{ color : googleIconColors[i] }}>{el}</span>)}</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Login;