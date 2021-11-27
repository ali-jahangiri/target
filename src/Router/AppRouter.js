import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AllWeekSchedule, HabitPerWeek, Home, NewTarget, NotFound, DevPlayground, Targets, Profile , Recovery, MindBord} from "../Pages";

const AppRouter = () => (
  <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/target" component={Targets} />
          <Route path="/newTarget" component={NewTarget} />
          <Route path="/habitPerWeek/:id" component={HabitPerWeek} />
          <Route path="/habitPerWeek" component={AllWeekSchedule} />
          <Route path="/mindBord" component={MindBord} />
          <Route path="/profile" component={Profile} />
          <Route path="/recovery" component={Recovery} />
          <Route path="/devPlayground" component={DevPlayground} />
          <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>
)

export default AppRouter;
