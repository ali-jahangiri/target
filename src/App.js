import { AlertContainer } from "./components/Alert";
import AuthGuard from "./Providers/AuthGuard/AuthGuard";
import RequestProvider from "./Providers/RequestProvider/RequestProvider";
import AppRouter from "./Router/AppRouter";

const App = () => (
  <>
        <AlertContainer/>
        <RequestProvider>
          <AuthGuard >
            <AppRouter />
          </AuthGuard>
        </RequestProvider>
  </>
)

export default App;