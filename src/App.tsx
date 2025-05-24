import { useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: string }>>([])
  const [input, setInput] = useState('')

  const sendMessage = async (message: string) => {
    const apiUrl: string = import.meta.env.VITE_API_URL || '';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (response.ok) {
      const data = await response.text();
      setMessages((prev) => [...prev, { text: data || 'No response', sender: 'bot' }]);
    } else {
      setMessages((prev) => [...prev, { text: 'Error: Failed to get response from API', sender: 'bot' }]);
    }
  };

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
            onKeyUp={async (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                setMessages([...messages, { text: input, sender: 'user' }]);
                await sendMessage(input);
                setInput('');
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
