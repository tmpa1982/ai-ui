import React from "react"
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "./msalConfig"
import { MessageCircle } from "lucide-react";

const Login: React.FC = () => {
  const { instance } = useMsal();
  return (
    <div className="login-center-container h-full flex flex-col justify-center items-center">
      <div className="content-box p-8 justify-center">
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
