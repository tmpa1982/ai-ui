import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [messages, setMessages] = useState<Array<{ text: string; sender: string }>>([])
  const [input, setInput] = useState('')

  return (
    <>
      <div className="chat-container">
        <div className="chat-history">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                setMessages([...messages, { text: input, sender: 'user' }]);
                setInput('');
                e.preventDefault();
              }
            }}
            placeholder="Type your message..."
            rows={4}
            style={{ resize: 'none' }}
          />
        </div>
      </div>
    </>
  )
}

export default App
