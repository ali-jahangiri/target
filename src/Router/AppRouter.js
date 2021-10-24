import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AllWeekSchedule, HabitPerWeek, Home, NewTarget, NotFound, DevPlayground, Targets, Profile } from "../Pages";

const AppRouter = () => (
  <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/target" component={Targets} />
          <Route path="/newTarget" component={NewTarget} />
          <Route path="/habitPerWeek/:id" component={HabitPerWeek} />
          <Route path="/habitPerWeek" component={AllWeekSchedule} />
          <Route path="/profile" component={Profile} />
          <Route path="/devPlayground" component={DevPlayground} />
          <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>
)

export default AppRouter;
