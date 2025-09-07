import React from "react"
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "./msalConfig"
import { MessageCircle } from "lucide-react";

const Login: React.FC = () => {
  const { instance } = useMsal();
  return (
    <div className="login-center-container h-full flex flex-col justify-center items-center">
      <MessageCircle className="w-16 h-16" />
      <h1 className="text-gray-200 font-medium text-2xl m-4">Interview Agent</h1>
      <p className="text-gray-500 text-s m-3">Sign in to start chatting with our AI-powered assistant</p>
      <button
        className="btn-primary m-4 px-8 py-4"
        onClick={() => instance.loginPopup(loginRequest)}
      >
        Sign in with Microsoft
      </button>
    </div>
  )
}

export default Login
