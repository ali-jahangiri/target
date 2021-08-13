import { useState } from "react";
import { useEffect } from "react";
import Header from "../components/Header"
import TargetBox from "../components/TargetBox";
import { references } from "../firebase";

const Targets = () => {
    const [loading, setLoading] = useState(true);
    const [allTarget, setAllTarget] = useState([]);

    useEffect(() => {
        references.target.onSnapshot(snapshot => {
            setAllTarget(snapshot.docs.map(el => el.data()))
            setLoading(false)
        })
    } , []);
    console.log(allTarget);
    return (
        <div className="target">
            <Header>target we got started with</Header>
            <div className="target__container">
                {
                    allTarget.map((el , i) => <TargetBox key={i} {...el} />)
                }
            </div>
        </div>
    )
}   


export default Targets;