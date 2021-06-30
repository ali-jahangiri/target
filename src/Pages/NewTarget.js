import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Header from "../components/Header";

const NewTarget = () => {
    const [panelIsOpen, setPanelIsOpen] = useState(false);

    return (
        <div className="targetCreator">
            <Header>
                have new Target ?
            </Header>
        </div>
    )
}


export default NewTarget;