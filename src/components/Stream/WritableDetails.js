import { useRef , useEffect, useState, useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { debounce, requests, selfClearTimeout } from "../../utils";



const WritableDetails = ({ streamId , isInCloseProcess }) => {
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState("");

  
  useEffect(() => {
    selfClearTimeout(() => inputRef.current?.focus(), 3000);
  }, [inputRef]);
  
  useEffect(function getInitialInputValue() {
    requests.stream.getStreamDetails(streamId)
      .then(setInputValue);
  } , []);

  const debouncedInputValueLiftHandler = useCallback(debounce((passedInputValue = "") => {
    requests.stream.setStreamDetails(streamId , passedInputValue)
  } , 250) , []);

  const onInputValueChange = ({ target: { value } }) => {
    setInputValue(value);
    debouncedInputValueLiftHandler(value)
  }

  return (
      <div className={`writeableDetails ${isInCloseProcess ? "writeableDetails--inCloseProcess" : ""}`}>
          <TextareaAutosize
            placeholder="write and save your idea about this habit..."
            ref={inputRef}
            value={inputValue}
            onChange={onInputValueChange}
            className="writeableDetails__input"
          />
      </div>
    );
}



export default WritableDetails;