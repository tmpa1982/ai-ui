import Markdown from "react-markdown"

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex">
      <div className={`message user text-right ml-auto bg-blue-500 text-white border-2 border-gray-500 rounded-2xl m-1 p-2 max-w-3/4 inline-block`}>
        <Markdown>{text}</Markdown>
      </div>
    </div>
  )
}

export default UserMessage
