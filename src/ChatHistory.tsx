import UserMessage from './UserMessage'
import BotMessage from './BotMessage'

interface ChatHistoryProps {
  messages: Array<{ text: string; sender: string }>
}

function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <div className="chat-history flex-1 m-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {messages.map((message, index) => {
          const MessageComponent = message.sender === 'user' ? UserMessage : BotMessage
          return <MessageComponent key={index} text={message.text} />
      })}
    </div>
  )
}

export default ChatHistory
