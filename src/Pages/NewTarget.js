import { useState } from "react";

import Container from "../components/Container";
import Input from "../components/Input";
import HabitListCreator from "../components/HabitListCreator";
import TargetItemColorPicker from "../components/TargetItemColorPicker";


import { useHistory } from "react-router";
import { idGenerator } from "../utils";
import { useDispatch } from "../Store/Y-State";
import { setNewTarget } from "../Store/slices/targetSlice";

const NewTarget = () => {
  const [target, setTarget] = useState({});
  const history = useHistory();

  const dispatcher = useDispatch();

  const changeHandler = (key, value) => {
    setTarget((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  const createNewTargetHandler = () => {
	const id = idGenerator();
    dispatcher(setNewTarget({ id , details : target }));
    history.push(`habitPerWeek/${id}`);
  }

  return (
    <div className="newTarget" >
      <div className="newTarget__container">
        <Container>
          <Input showLabel onChange={(value) => changeHandler("targetName", value)} placeholder="Target Name" />
          <HabitListCreator
            haveTargetColor={target?.color}
            habit={target?.habit || []}
            onChange={changeHandler}
          />
          <TargetItemColorPicker
            onDone={createNewTargetHandler}
            selectedColor={target?.color || ""}
            onChange={(color) => changeHandler("color", color)}
          />
        </Container>
      </div>
    </div>
  );
};

export default NewTarget;
