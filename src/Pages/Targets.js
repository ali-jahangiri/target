import Header from "../components/Header"
import Menu from "../components/Menu";
import TargetBox from "../components/TargetBox";
import TargetCreateNewOne from "../components/TargetCreateNewOne";
import useFetcher from "../Hook/useFetcher";


const Targets = () => {
    const { data , loading } = useFetcher(req => req.target.getTargetList, [])

    return (
        <Menu loading={loading}>
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
        </Menu>
    )
}   


export default Targets;