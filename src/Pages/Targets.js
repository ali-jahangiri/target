import Header from "../components/Header"
import RedirectToCreateNewTarget from "../components/RedirectToCreateNewTarget";
import TargetBox from "../components/TargetBox";
import useFetcher from "../Hook/useFetcher";
import { requests } from "../utils";




const Targets = () => {

    const { data : allTarget , loading } = useFetcher(req => req.target.getTargetList)

    console.log(allTarget);

    const deleteHabit = (targetId , habitName) => {
        
    }

    const deleteTarget = targetId => {
        requests.target.deleteTarget(targetId)
            .then(data => {
                console.log(data , "removed");
            })
    } 

    if(loading) return 'loading';
    return (
        <div className="target">
            <Header>target we got started with</Header>
            {/* <RedirectToCreateNewTarget /> */}
            <div className="target__container">
                {
                    allTarget.map((el , i) => <TargetBox deleteHandler={deleteTarget} key={i} {...el} />)
                }
            </div>
        </div>
    )
}   


export default Targets;