import React from "react"
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "./msalConfig"

const Login: React.FC = () => {
  const { instance } = useMsal();
  return (
    <div className="login-center-container h-full flex flex-col justify-center items-center">
      <h1 className="text-gray-200 font-medium text-2xl m-4">Interview Agent</h1>
      <p className="text-gray-500 text-s m-3">Sign in to start chatting with our AI-powered assistant</p>
      <button
        className="m-4 px-8 py-4 text-sm text-gray-200 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors flex items-center gap-2"
        onClick={() => instance.loginPopup(loginRequest)}
      >
        Sign in with Microsoft
      </button>
    </div>
  )
}

export default Login
