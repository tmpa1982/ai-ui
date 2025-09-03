import Message from './Message'

function BotMessage({ text }: { text: string }) {
  return (
    <Message
      text={text}
      align="left"
      bgColor="bg-gray-700"
      textColor="text-gray-300"
    />
  )
}

export default BotMessage
