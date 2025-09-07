import { useIsAuthenticated } from "@azure/msal-react";
import Interview from './Interview';
import Login from './Login';

function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="app-container h-screen bg-gray-900 text-gray-50">
      {!isAuthenticated ? (
        <Login />
      ) : (
        <Interview />
      )}
    </div>
  )
}

export default App
