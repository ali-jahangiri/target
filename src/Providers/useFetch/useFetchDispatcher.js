import { useContext } from "react";
import { FetchContext } from "./FetchProvider";

const useFetchDispatcher = () => {
  const { changeHandler } = useContext(FetchContext);

  return {
    changeHandler,
  };
};

export default useFetchDispatcher;
