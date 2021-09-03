import { useHistory } from "react-router";

const RedirectToCreateNewTarget = () => {
    const history = useHistory()
    return (
        <div onClick={() => history.push('/newTarget')}>
            Have new Idea ? create new one !
        </div>
    )
}


export default RedirectToCreateNewTarget;