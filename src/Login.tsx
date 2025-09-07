import React from "react"
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "./msalConfig"

const Login: React.FC = () => {
  const { instance } = useMsal();
  return (
    <div className="login-center-container h-full flex justify-center items-center">
      <button
        className="px-8 py-4 text-sm text-gray-200 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors flex items-center gap-2"
        onClick={() => instance.loginPopup(loginRequest)}
      >
        Sign in with Microsoft
      </button>
    </div>
  )
}

export default Login
