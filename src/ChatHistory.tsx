import UserMessage from './UserMessage'
import BotMessage from './BotMessage'

import type { Message } from './types'

interface ChatHistoryProps {
  messages: Message[]
}

function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <div className="chat-history flex-1 m-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {messages.map((message) => {
          const MessageComponent = message.sender === 'user' ? UserMessage : BotMessage
          return <MessageComponent key={message.id} text={message.text} />
      })}
    </div>
  )
}

export default ChatHistory
