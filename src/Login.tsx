import React from "react"
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "./msalConfig"
import { MessageCircle } from "lucide-react";

const Login: React.FC = () => {
  const { instance } = useMsal();
  return (
    <div className="login-center-container h-full flex flex-col justify-center items-center">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 flex flex-col justify-center items-center text-center shadow-[0_0_8px_rgba(255,255,255,0.7)]">
        <MessageCircle className="w-16 h-16" />
        <h1 className="heading-main">Interview Agent</h1>
        <p className="description-text">Sign in to start chatting with our AI-powered assistant</p>
        <button
          className="btn-primary m-4 px-8 py-4"
          onClick={() => instance.loginPopup(loginRequest)}
        >
          Sign in with Microsoft
        </button>
      </div>
    </div>
  )
}

export default Login
