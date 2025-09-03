import { useEffect, useRef } from 'react'
import UserMessage from './UserMessage'
import BotMessage from './BotMessage'
import { Loader2 } from 'lucide-react'
import type { Message } from './types'

interface ChatHistoryProps {
  messages: Message[]
  isLoading: boolean
}

function ChatHistory({ messages, isLoading }: ChatHistoryProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  };

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div ref={chatContainerRef} className="chat-history flex-1 m-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {messages.map((message) => {
          const MessageComponent = message.sender === 'user' ? UserMessage : BotMessage
          return <MessageComponent key={message.id} text={message.text} timestamp={message.timestamp} />
      })}

      {isLoading && (
        <div className="flex items-center gap-2 text-gray-300 p-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Thinking...</span>
        </div>
      )}
    </div>
  )
}

export default ChatHistory
