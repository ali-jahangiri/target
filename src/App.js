import { AlertContainer } from "./components/Alert";
import AuthGuard from "./Providers/AuthGuard/AuthGuard";
import AppRouter from "./Router/AppRouter";

const App = () => (
  <>
    <AlertContainer/>
    <AuthGuard >
        <AppRouter />
    </AuthGuard>
  </>
)

export default App;