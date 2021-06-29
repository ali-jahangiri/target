import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const FetchContext = createContext({
  changeHandler: () => {},
  api: axios.create({}),
});

// NOTE packageName , baseUrl are static values that we need to have any kine of request.

const FetchProvider = ({ children, baseURL }) => {
  const [fetcherOption, setFetcherOption] = useState({});

  const changeHandler = (data) => {
    console.log("chnage", { headers: { ...data } });
    setFetcherOption(() => ({}));
  };

  const api = axios.create({
    baseURL,
    headers: {
      ...fetcherOption,
    },
  });

  console.log("after set", fetcherOption);
  return (
    <FetchContext.Provider value={{ api, changeHandler }}>
      {children}
    </FetchContext.Provider>
  );
};

export default FetchProvider;
