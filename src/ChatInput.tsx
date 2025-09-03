import { useState } from 'react'
import { Send } from 'lucide-react'

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
    <div className="chat-input flex px-6 py-4 bg-gray-800 border-t border-gray-700">
      <textarea
        className="bg-gray-700 border-2 border-gray-500 rounded-lg flex-1 p-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={async (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        placeholder="Type your message..."
        rows={2}
      />
      <button
        className="send-button ml-5 p-4 border-2 border-gray-500 rounded-lg bg-blue-500 text-white"
        onClick={handleSendMessage}
      >
        <Send size={24} />
      </button>
    </div>
  )
}

export default ChatInput
