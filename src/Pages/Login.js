import Input from "../components/Input"
import useKeyBaseState from "../Hook/useKeyBaseState";

import Btn from "../components/Btn";
import { firebaseAuth, singInWithGoogle } from "../firebase/firebase";


const Login = () => {
    const [inputValue , setInputValue] = useKeyBaseState();

    const loginHandler = async () => {
        const { userName , password } = inputValue
        console.log(inputValue);
        const result = await singInWithGoogle()
        console.log(result , "*");
        // firebaseAuth.createUserWithEmailAndPassword(userName , password)
        //     .then(data => {
        //         console.log(data , '!!!!!!!!!!!!!!');
        //     })
    }

    return (
        <div className="login">
            <div className="login__intro">
                <div className="login__introText"></div>
            </div>
            <div className="login__mainSection">
                <div className="login__form">
                    <div className="login__header">
                        <div>
                            <p>Hi There ! </p>
                            <p>Let's Login</p>
                        </div>
                    </div>
                    <Input
                        showLabel
                        mode="dark" 
                        placeholder="User Name" 
                        value={inputValue?.userName || ""} 
                        onChange={value => setInputValue('userName' , value)} />
                    <Input 
                        showLabel
                        mode="dark" 
                        placeholder="Password" 
                        type="password"
                        value={inputValue?.password || ""} 
                        onChange={value => setInputValue('password' , value)} />
                    <Btn style={{ marginTop : "1rem" }} onClick={loginHandler}>
                        Click for sing in
                    </Btn>
                </div>
            </div>
        </div>
    )
}


export default Login;