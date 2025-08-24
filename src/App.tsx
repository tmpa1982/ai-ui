import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./msalConfig";
import Interview from './Interview';

function App() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="app-container h-screen bg-gray-900 text-gray-50 p-2">
      {!isAuthenticated ? (
        <div className="login-center-container h-full flex justify-center items-center">
          <button className="login-button border-2 border-gray-500 rounded-lg m-2 p-4 px-8 text-gray-400 font-bold"
          onClick={() => instance.loginPopup(loginRequest)}>Login</button>
        </div>
      ) : (
        <Interview />
      )}
    </div>
  )
}

export default App
