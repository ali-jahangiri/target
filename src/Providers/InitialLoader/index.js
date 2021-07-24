import { useEffect, useState } from "react";
import { useDispatch } from "../../Store/Y-State";

import db from "../../firebase";

import { setUser } from "../../Store/slices/userSlice";
import { ErrorPage, LoadingPage } from "../../Pages";

const client_id = "764ed27cabac1f5a2fc3";
const client_secret = "f33bec95761c696f667fdb06674fbc3f";

// const timeoutPromise = (promise, timeout = 1000) => {
//   const timeoutThrower = new Promise((_, rej) => {
//     let timer = setTimeout(() => {
//       rej(new Error("timeout error!"));
//       clearTimeout(timer);
//     }, timeout);
//   });

//   return Promise.race([promise, timeoutThrower])
//     .then((data) => {
//       console.log(data);
//       return data;
//     })
//     .catch((err) => {
//       throw new Error(err);
//     });
// };

// const fetchFromJson = fetch("https://jsonplaceholder.typicode.com/todos/1");

// timeoutPromise(fetchFromJson, 2000)
//   .then((data) => {
//     console.log("data", data);
//   })
//   .catch((err) => {
//     console.error(err, "");
//   });

const InitialLoader = ({ children }) => {

  const [loading, setLoading] = useState(true);
  const [stuckInLoading, setStuckInLoading] = useState(false);
  const dispatch = useDispatch();



  useEffect(() => {
    db
    .collection("user").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((el) => el.data()).pop();
      dispatch(() => setUser(data));
      setLoading(false);
    });

  }, []);

  if (stuckInLoading) return <ErrorPage message={stuckInLoading} />;
  else if (loading) return <LoadingPage />;
  else {
    return children;
  }
};

export default InitialLoader;
