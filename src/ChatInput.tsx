import { useState } from 'react'
import { Send, CircleStop } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onStop: () => void
  isLoading: boolean
}

function ChatInput({ onSendMessage, onStop, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  }

  return (
    <div className="chat-input flex flex-col p-3 bg-gray-800 border-t border-gray-700 items-center sticky bottom-0 pb-[env(safe-area-inset-bottom)] z-10">
      <div className="flex w-full gap-3">
        <textarea
          className="flex-1 resize-none bg-gray-700 border border-gray-600 rounded-xl p-3 text-base text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out min-h-[48px] max-h-40"
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
          className="send-button btn-chat-input"
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
        >
          <Send size={22} />
        </button>
        <button
          className="stop-button btn-chat-input"
          onClick={onStop}
          disabled={isLoading}
          aria-label="Stop Interview"
        >
          <CircleStop size={22} />
        </button>
      </div>
      <p className="text-gray-500 text-xs my-2">Press Enter to send, Shift + Enter for new line</p>
    </div>
  )
}

export default ChatInput
