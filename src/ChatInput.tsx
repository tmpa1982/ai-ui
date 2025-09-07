import { useState } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  }

  return (
    <div className="chat-input flex flex-col px-6 py-4 bg-gray-800 border-t border-gray-700 items-center">
      <div className="flex w-full">
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
          disabled={!input.trim() || isLoading}
        >
          <Send size={24} />
        </button>
      </div>
      <p className="text-gray-500 text-xs mt-2">Press Enter to send, Shift + Enter for new line</p>
    </div>
  )
}

export default ChatInput
