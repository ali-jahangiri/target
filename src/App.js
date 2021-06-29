import { useState } from "react";
import db from "./firebase";
import AppRouter from "./Router/AppRouter";

import axios from "axios";
import FetchProvider from "./Providers/useFetch/FetchProvider";
import useFetch, { useFetchDispatcher } from "./Providers/useFetch";

function App() {
  const [data, setData] = useState([]);
  const { changeHandler } = useFetchDispatcher();
  // db.collection("target").onSnapshot((snapshot) => {
  //   console.log(
  //     snapshot.docs.map((el) => ({ id: el.id, name: el.data().name }))
  //   );
  // });
  const { loading, response, error } = useFetch(
    "https://api.artsy.net/api/tokens/xapp_token",
    {
      client_id: "764ed27cabac1f5a2fc3",
      client_secret: "f33bec95761c696f667fdb06674fbc3f",
    }
  );

  console.log("sd", loading, response, error);
  if (!loading && !error) {
    console.log(changeHandler);
    changeHandler({
      "X-XAPP-Token": response.token,
    });
  }
  // axios
  //   .get("https://api.artsy.net/api/shows", {
  //     headers: {
  //       "X-XAPP-Token":
  //         "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiI2MGRiNTQxMDU5M2UyMDAwMGY0ZGU1NzQiLCJleHAiOjE2MjU1OTE0NDEsImlhdCI6MTYyNDk4NjY0MSwiYXVkIjoiNjBkYjU0MTA1OTNlMjAwMDBmNGRlNTc0IiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjYwZGI1NDExYWFmYzAzMDAwZjBkMWM1MCJ9.73u0x5UV8wx2JmYj5YqXlEGAei5F1TBg8zkmnrz9gOc",
  //     },
  //   })
  //   .then(({ data }) => {
  //     console.log(data);
  //   });

  return <AppRouter />;
}

export default App;
