import { useEffect, useState } from "react";

import Container from "../components/Container";
import Input from "../components/Input";
import HabitListCreator from "../components/HabitListCreator";
import TargetItemColorPicker from "../components/TargetItemColorPicker";
import { useSelector } from "../Store/Y-State";
import { randomItemFromArr } from "../utils";

import db from "../firebase";
import { useHistory } from "react-router";

const NewTarget = () => {
  const [target, setTarget] = useState({});
  const history = useHistory();
  const [currentImage, setCurrentImage] = useState("");
  const image = useSelector((state) => state.artwork);

  const changeHandler = (key, value) => {
    setTarget((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    setCurrentImage(randomItemFromArr(image));
  }, []);

  const createNewTargetHandler = () => 
        history.push('/scheduleHabit', {target} );

  return (
    <div
      style={{ backgroundImage: `url(${currentImage})` }}
      className="newTarget"
    >
      <div className="newTarget__container">
        <Container>
          <Input
            showLabel
            onChange={(value) => changeHandler("targetName", value)}
            placeholder="Target Name"
          />
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
