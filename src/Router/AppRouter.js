import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AllWeekSchedule, HabitPerWeek, Home, NewTarget, NotFound, Playground, Targets, UserSetup } from "../Pages";

const AppRouter = () => (
  <BrowserRouter>
        <Switch>
          <Route path="/playground" component={Playground} />
          <Route path="/" component={Home} exact />
          <Route path="/target" component={Targets} />
          <Route path="/newTarget" component={NewTarget} />
          <Route path="/habitPerWeek/:id" component={HabitPerWeek} />
          <Route path="/habitPerWeek" component={AllWeekSchedule} />
          <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>
)

export default AppRouter;
