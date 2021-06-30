import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home, NewTarget, Targets, Today, UserSetup } from "../Pages";
import { useSelector } from "../Store/Y-State";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  const state = useSelector(state => state)
  console.log(state, " *//*/**//*");
  return (
    <BrowserRouter>
        <Switch>
          <Route path="/setup" component={UserSetup} />
          <PrivateRoute>
            <Route path="/" component={Home} exact />
            <Route path="/target" component={Targets} />
            <Route path="/newTarget" component={NewTarget} />
            <Route path="/today" component={Today} />
          </PrivateRoute>
        </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
