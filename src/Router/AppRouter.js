import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AllWeekSchedule, HabitPerWeek, Home, Login, NewTarget, NotFound, Playground, Targets, UserSetup } from "../Pages";

import PrivateRoute from "./PrivateRoute";

const AppRouter = () => (
  <BrowserRouter>
        <Switch>
          {/* <Route path="/setup" component={UserSetup} /> */}
          <Route path="/playground" component={Playground} />
          {/* <PrivateRoute> */}
            <Route path="/" component={Home} exact />
            <Route path="/target" component={Targets} />
            <Route path="/newTarget" component={NewTarget} />
            <Route path="/habitPerWeek/:id" component={HabitPerWeek} />
            <Route path="/habitPerWeek" component={AllWeekSchedule} />
            <Route path="/login" component={Login} />
          {/* </PrivateRoute> */}
          <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>
)

export default AppRouter;
