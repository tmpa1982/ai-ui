import Message from './Message'

function UserMessage({ text }: { text: string }) {
  return (
    <Message
      text={text}
      align="right"
      bgColor="bg-blue-500"
      textColor="text-white"
    />
  )
}

export default UserMessage
