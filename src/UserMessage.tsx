import Message from './Message'

function UserMessage({ text, timestamp }: { text: string; timestamp?: Date }) {
  return (
    <Message
      text={text}
      align="right"
      bgColor="bg-blue-500"
      textColor="text-white"
      timestamp={timestamp}
    />
  )
}

export default UserMessage
