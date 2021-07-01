import { BrowserRouter, Route, Switch } from "react-router-dom";

import { HabitPerDay, Home, NewTarget, Targets, Today, UserSetup } from "../Pages";

import PrivateRoute from "./PrivateRoute";

const AppRouter = () => (
  <BrowserRouter>
        <Switch>
          <Route path="/setup" component={UserSetup} />
          <PrivateRoute>
            <Route path="/" component={Home} exact />
            <Route path="/target" component={Targets} />
            <Route path="/newTarget" component={NewTarget} />
            <Route path="/today" component={Today} />
            <Route path="/scheduleHabit" component={HabitPerDay} />
          </PrivateRoute>
        </Switch>
    </BrowserRouter>
)

export default AppRouter;
