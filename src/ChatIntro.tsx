import { Bot } from "lucide-react"

export default function ChatIntro() {
  return (
    <div className="chat-intro-container h-full flex flex-col justify-center items-center text-center px-4">
      <Bot className="w-16 h-16" />
      <h1 className="heading-main">
        Start a conversation
      </h1>
      <p className="text-gray-500 text-s m-3">
        Ask me anything! I'm here to help with your questions and provide assistance.
      </p>
    </div>
  )
}
