import { useState } from 'react'

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  }

  return (
    <div className="chat-input flex">
      <textarea
        className="border-2 border-gray-500 rounded-lg m-2 p-2 flex-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={async (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        placeholder="Type your message..."
        rows={3}
      />
      <button
        className="send-button border-2 border-gray-500 rounded-lg m-2 p-4 bg-blue-500 text-white font-bold"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  )
}

export default ChatInput
