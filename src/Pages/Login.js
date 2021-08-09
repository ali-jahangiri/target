
import { Emoji } from "react-apple-emojis";
import Input2 from "../components/Input2"
import useKeyBaseState from "../Hook/useKeyBaseState";

import Btn from "../components/Btn";

import { firebaseAuth } from "../firebase"

const Login = () => {
    const [inputValue , setInputValue] = useKeyBaseState();

    const loginHandler = () => {
        const { userName , password } = inputValue
        firebaseAuth.createUserWithEmailAndPassword(userName , password)
            .then(data => {
                console.log(data , '!!!!!!!!!!!!!!');
            })
    }

    return (
        <div className="login">
            {/* <div className="login__intro">
                <div className="login__introText">
                        <Emoji name="brain" />
                        <p>Discover user life as a simple stream !</p>
                </div>
            </div> */}
            <div className="login__mainSection">
                <div className="login__form">
                    <div className="login__header">
                        <Emoji name="waving-hand" />
                        <div>
                            <p>Hi There ! </p>
                            <p>Let's Login</p>
                        </div>
                    </div>
                    <Input2 placeholder="User Name" value={inputValue?.userName} onChang={value => setInputValue('userName' , value)} />
                    <Input2 placeholder="Password" value={inputValue?.password} onChang={value => setInputValue('password' , value)} />
                    <Btn onClick={loginHandler} />
                </div>
            </div>
        </div>
    )
}


export default Login;