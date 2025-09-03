import Message from './Message'
import { User } from 'lucide-react'

function UserMessage({ text, timestamp }: { text: string; timestamp?: Date }) {
  return (
    <Message
      text={text}
      align="right"
      bgColor="bg-blue-500"
      textColor="text-white"
      timestamp={timestamp}
      icon={User}
    />
  )
}

export default UserMessage
