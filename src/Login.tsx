import React from "react"
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "./msalConfig"

const Login: React.FC = () => {
  const { instance } = useMsal();
  return (
    <div className="login-center-container h-full flex justify-center items-center">
      <button
        className="login-button border-2 border-gray-500 rounded-lg m-2 p-4 px-8 text-gray-400 font-bold"
        onClick={() => instance.loginPopup(loginRequest)}
      >
        Login
      </button>
    </div>
  )
}

export default Login
