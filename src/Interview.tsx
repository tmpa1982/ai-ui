import { useState } from 'react'
import { useMsal, useAccount } from "@azure/msal-react";
import { apiRequest } from "./msalConfig";
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
import Header from './Header'
import type { Message } from './types'

function Interview() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
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
      await sendMessage(input);
    }
  }

  const sendMessage = async (message: string) => {
    const token = await getToken();
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="chat-container h-screen flex flex-col [&::-webkit-scrollbar]:hidden">
      <Header />
      <ChatHistory messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={extractAndSendMessage} isLoading={isLoading} />
    </div>
  )
}

export default Interview
