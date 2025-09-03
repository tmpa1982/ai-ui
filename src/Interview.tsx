import { useState, useEffect } from 'react'
import { useMsal, useAccount } from "@azure/msal-react";
import { apiRequest } from "./msalConfig";
import ChatHistory from './ChatHistory'
import type { Message } from './types'

function Interview() {
  const [messages, setMessages] = useState<Message[]>([])
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

  const createMessage = (text: string, sender: 'user' | 'bot'): Message => ({
    id: crypto.randomUUID(),
    text,
    sender,
    timestamp: new Date()
  })

  const extractAndSendMessage = async (input: string) => {
    if (input.trim()) {
      setMessages([...messages, createMessage(input, 'user')]);
      setInput('');
      await sendMessage(input);
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string) => {
    const token = await getToken();
    try {
      const apiUrl: string = import.meta.env.VITE_API_URL || 'https://tran-llm-daatfkc6hhf0a8hf.southeastasia-01.azurewebsites.net';
      const response = await fetch(`${apiUrl}/langgraph/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, createMessage(data || 'No response', 'bot')]);
      } else {
        setMessages((prev) => [...prev, createMessage('Error: Failed to get response from API', 'bot')]);
      }
    } catch (err) {
      console.error("API call failed:", err);
    }
  };

  const scrollToBottom = () => {
    const chatHistory = document.querySelector('.chat-history');
    if (chatHistory) {
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  }

  return (
    <div className="chat-container h-screen flex flex-col [&::-webkit-scrollbar]:hidden">
      <ChatHistory messages={messages} />
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
          className="send-button border-2 border-gray-500 rounded-lg m-2 p-4 bg-blue-500 text-white font-bold"
          onClick={() => extractAndSendMessage(input)}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Interview
