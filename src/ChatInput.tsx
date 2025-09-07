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
    <div className="chat-input flex flex-col px-6 py-4 bg-gray-800 border-t border-gray-700 items-center sticky bottom-0 pb-[env(safe-area-inset-bottom)] z-10">
      <div className="flex w-full gap-4">
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
          className="send-button flex items-center justify-center ml-2 px-5 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
        >
          <Send size={22} />
        </button>
      </div>
      <p className="text-gray-500 text-xs my-2">Press Enter to send, Shift + Enter for new line</p>
    </div>
  )
}

export default ChatInput
