import { useEffect, useState } from "react";
import { set } from "../../Store/slices/artWorkSlice";
import { useDispatch } from "../../Store/Y-State";

import db from "../../firebase";

import useFetch, { useFetchDispatcher } from "../useFetch";
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
  const api = useFetch();
  const [loading, setLoading] = useState(true);
  const [stuckInLoading, setStuckInLoading] = useState(false);
  const fetchDispatcher = useFetchDispatcher();
  const dispatch = useDispatch();



  useEffect(() => {

    api
      .post("https://api.artsy.net/api/tokens/xapp_token", {
        client_id,
        client_secret,
      })
      .then(({ data }) => {
        fetchDispatcher({ "X-XAPP-Token": data.token });
        return data.token;
      })
      .then((token) => {
        return api
          .get("artworks", { headers: { "X-XAPP-Token": token } })
          .then(({ data }) => {
            dispatch(() =>
              set(data._embedded.artworks.map((el) => el._links.image.href.replace("{image_version}", "larger"))));
          });
      })
      .then((_) => {
        db.collection("user").onSnapshot((snapshot) => {
          const data = snapshot.docs.map((el) => el.data()).pop();
          dispatch(() => setUser(data));
          setLoading(false);
        });
      })
      .catch((err) => {
        setStuckInLoading(err.message);
      });
  }, []);

  if (stuckInLoading) return <ErrorPage message={stuckInLoading} />;
  else if (loading) return <LoadingPage />;
  else {
    return children;
  }
};

export default InitialLoader;
