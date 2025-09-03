import Message from './Message'

function BotMessage({ text, timestamp }: { text: string; timestamp?: Date }) {
  return (
    <Message
      text={text}
      align="left"
      bgColor="bg-gray-700"
      textColor="text-gray-300"
      timestamp={timestamp}
    />
  )
}

export default BotMessage
