import { AlertContainer } from "./components/Alert";
import RequestProvider from "./Providers/RequestProvider/RequestProvider";
import AppRouter from "./Router/AppRouter";

const App = () => (
  <>
        <AlertContainer/>
        <RequestProvider>
          <AppRouter />
        </RequestProvider>
  </>
)

export default App;
