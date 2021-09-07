import { useEffect } from "react";
import Header from "../components/Header"
import Loading from "../components/Loading";
import TargetBox from "../components/TargetBox";
import TargetCreateNewOne from "../components/TargetCreateNewOne";
import { references } from "../firebase";
import useFetcher from "../Hook/useFetcher";
import { requests } from "../utils";




const Targets = () => {

    const { data : allTarget , loading } = useFetcher(req => req.target.getTargetList, [])

    console.log(allTarget);

    // useEffect(() => {
    //     references.target.onSnapshot(snapshot => {
    //         snapshot.forEach(el => console.log(el.data()))
    //     })
    // } , [])

    const deleteHabit = (targetId , habitName) => {
        
    }


    return (
        <Loading loading={loading}>
            {isReady => {
                    if(isReady) return (
                        <div className="target">
                            <Header>Target we got started with</Header>
                            <div className="target__container">
                                <div>
                                {
                                    allTarget.map((el , i) => <TargetBox key={i} {...el} />)
                                }
                                <TargetCreateNewOne /> 
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        </Loading>
    )
}   


export default Targets;