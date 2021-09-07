import Header from "../components/Header"
import Loading from "../components/Loading";
import TargetBox from "../components/TargetBox";
import TargetCreateNewOne from "../components/TargetCreateNewOne";
import useFetcher from "../Hook/useFetcher";


const Targets = () => {
    const { data , loading } = useFetcher(req => req.target.getTargetList, [])

    return (
        <Loading loading={loading}>
            {isReady => {
                if(isReady) return (
                    <div className="target">
                        <Header>Target we got started with</Header>
                        <div className="target__container">
                            <div>
                                {
                                    data.map((el , i) => <TargetBox key={i} {...el} />)
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