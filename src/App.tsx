import { useState } from 'react'
import './App.css'
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./msalConfig";

function App() {
  const { instance } = useMsal();

  const [messages, setMessages] = useState<Array<{ text: string; sender: string }>>([])
  const [input, setInput] = useState('')

  const login = async () => {
    try {
      const loginResponse = await instance.loginPopup(loginRequest);
      instance.setActiveAccount(loginResponse.account);
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const sendMessage = async (message: string) => {
    try {
      const tokenResponse = await instance.acquireTokenSilent(loginRequest);

      const apiUrl: string = import.meta.env.VITE_API_URL || 'https://tran-llm-daatfkc6hhf0a8hf.southeastasia-01.azurewebsites.net/openai/question';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenResponse.accessToken}`,
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.text();
        setMessages((prev) => [...prev, { text: data || 'No response', sender: 'bot' }]);
      } else {
        setMessages((prev) => [...prev, { text: 'Error: Failed to get response from API', sender: 'bot' }]);
      }
    } catch (err) {
      console.error("API call failed:", err);
    }
  };

  return (
    <>
      <button onClick={login} className="login-button">Login</button>
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
