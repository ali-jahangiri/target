import { useState } from "react";
import { useHistory } from "react-router";

import Container from "../components/Container";
import Input from "../components/Input";
import HabitListCreator from "../components/HabitListCreator";
import TargetItemColorPicker from "../components/TargetItemColorPicker";

import { idGenerator } from "../utils";
import { firebaseAuth, references } from "../firebase";
import Menu from "../components/Menu";

const NewTarget = () => {
  const [target, setTarget] = useState({});
  const history = useHistory();
  const [isInCreationPend, setIsInCreationPend] = useState(false);
  
  const changeHandler = (key, value) => {
    setTarget((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const createNewTargetHandler = () => {
    setIsInCreationPend(true);
    const id = idGenerator();
    references(firebaseAuth.currentUser.uid).target.doc(id).set({ ...target })
      .then(_ => {
        history.push(`habitPerWeek/${id}`);
      })
  }

  return (
    <Menu renderImmediately>
      {_ => (
        <div className="newTarget" >
        <div className="newTarget__container">
          <Container>
            <Input 
              showLabel 
              onChange={(value) => changeHandler("targetName", value)} 
              placeholder="Target Name" />
            <HabitListCreator
              haveTargetColor={target?.color}
              habit={target?.habit || []}
              onChange={changeHandler}
            />
            <TargetItemColorPicker
              isValidToPass={target?.targetName}
              isPend={isInCreationPend}
              onDone={createNewTargetHandler}
              selectedColor={target?.color || ""}
              onChange={(color) => changeHandler("color", color)}
            />
          </Container>
        </div>
      </div>
      )}
    </Menu>
  );
};

export default NewTarget;
