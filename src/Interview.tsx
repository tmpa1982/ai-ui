import { useState } from 'react'
import { useMsal, useAccount } from "@azure/msal-react";
import { apiRequest } from "./msalConfig";

function Interview() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: string }>>([])
  const [input, setInput] = useState('')
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

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

  const extractAndSendMessage = async (input: string) => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      await sendMessage(input);
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
        const data = await response.json();
        setMessages((prev) => [...prev, { text: data || 'No response', sender: 'bot' }]);
      } else {
        setMessages((prev) => [...prev, { text: 'Error: Failed to get response from API', sender: 'bot' }]);
      }
    } catch (err) {
      console.error("API call failed:", err);
    }
  };

  return (
    <div className="chat-container h-full flex flex-col">
      <div className="chat-history flex-1 m-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {messages.map((message, index) => {
          const textAlign = message.sender === 'user' ? 'text-right' : 'text-left';
          const marginLeft = message.sender === 'user' ? 'ml-auto' : '';
          const backgroundColor = message.sender === 'user' ? 'bg-blue-500' : 'bg-gray-700';
          const textColor = message.sender === 'user' ? 'text-white' : 'text-gray-300';
          return (
            <div className="flex">
              <div key={index} className={`message ${message.sender} ${textAlign} ${marginLeft} ${backgroundColor} ${textColor} border-2 border-gray-500 rounded-2xl m-1 p-2 max-w-3/4 inline-block`}>
                {message.text}
              </div>
            </div>
          )
        })}
      </div>
      <div className="chat-input flex">
        <textarea
          className="border-2 border-gray-500 rounded-lg m-2 p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={async (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              extractAndSendMessage(input);
            }
          }}
          placeholder="Type your message..."
          rows={3}
        />
        <button
          className="send-button border-2 border-gray-500 rounded-lg m-2 p-4 text-gray-400 font-bold"
          onClick={() => extractAndSendMessage(input)}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Interview
