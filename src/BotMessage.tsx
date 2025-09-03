import Message from './Message'
import { Bot } from 'lucide-react'

function BotMessage({ text, timestamp }: { text: string; timestamp?: Date }) {
  return (
    <Message
      text={text}
      align="left"
      bgColor="bg-gray-700"
      textColor="text-gray-300"
      timestamp={timestamp}
      icon={Bot}
    />
  )
}

export default BotMessage
