import { useState } from 'react'
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
    <div className="app-container h-screen bg-gray-900 text-gray-50 p-2">
      {!isAuthenticated ? (
        <div className="login-center-container h-full flex justify-center items-center">
          <button className="login-button border-2 border-gray-500 rounded-lg m-2 p-4 px-8 text-gray-400 font-bold"
          onClick={() => instance.loginPopup(loginRequest)}>Login</button>
        </div>
      ) : (
        <div className="chat-container h-full flex flex-col">
          <div className="chat-history flex-1 m-2 text-gray-400">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input flex">
            <textarea
              className="border-2 border-gray-500 rounded-lg m-2 p-2 flex-1"
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
              rows={3}
            />
            <button
              className="send-button border-2 border-gray-500 rounded-lg m-2 p-4 text-gray-400 font-bold"
              onClick={async () => {
                if (input.trim()) {
                  setMessages([...messages, { text: input, sender: 'user' }]);
                  await sendMessage(input);
                  setInput('');
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
