import { useEffect, useRef } from 'react'
import UserMessage from './UserMessage'
import BotMessage from './BotMessage'

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

      {isLoading && <BotMessage text="Typing..." />}
    </div>
  )
}

export default ChatHistory
