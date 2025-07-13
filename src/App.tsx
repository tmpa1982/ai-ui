import { useState } from 'react'
import './App.css'
import { useMsal, useAccount, useIsAuthenticated } from "@azure/msal-react";
import { apiRequest, loginRequest } from "./msalConfig";

function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount(accounts[0] || {});

  const [messages, setMessages] = useState<Array<{ text: string; sender: string }>>([])
  const [input, setInput] = useState('')

  async function getToken() {
    try {
      const response = await instance.acquireTokenSilent({
        ...apiRequest,
        account: account!,
      });
      return response.accessToken;
    } catch (error) {
      // fallback to interactive if silent fails
      const response = await instance.acquireTokenPopup(apiRequest);
      return response.accessToken;
    }
  }

  const sendMessage = async (message: string) => {
    const token = await getToken();
    try {
      const apiUrl: string = import.meta.env.VITE_API_URL || 'https://tran-llm-daatfkc6hhf0a8hf.southeastasia-01.azurewebsites.net';
      const response = await fetch(`${apiUrl}/openai/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
      {!isAuthenticated ? (
        <div className="login-center-container">
          <button onClick={() => instance.loginPopup(loginRequest)} className="login-button">Login</button>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-history">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input" style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
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
              style={{ resize: 'none', flex: 1 }}
            />
            <button
              className="send-button"
              onClick={async () => {
                if (input.trim()) {
                  setMessages([...messages, { text: input, sender: 'user' }]);
                  await sendMessage(input);
                  setInput('');
                }
              }}
              style={{ height: '48px' }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
