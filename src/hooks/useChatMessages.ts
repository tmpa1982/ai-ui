import { useState } from 'react'
import { useAccessToken } from "./useAccessToken"
import type { ChatResponse, Evaluation, Message } from '../types'
import apiUrl from '../apiUrl'

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { getToken } = useAccessToken()

  const createMessage = (text: string, sender: 'user' | 'bot'): Message => ({
    id: crypto.randomUUID(),
    text,
    sender,
    timestamp: new Date()
  })

  const extractAndSendMessage = async (input: string) => {
    if (!input.trim() || isLoading) return
    setMessages(prev => [...prev, createMessage(input, 'user')])
    await sendMessage(input)
  }

  const endInterview = async () => {
    if (isLoading) return
    await sendMessage("", true)
  }

  const sendMessage = async (message: string, endInterview: boolean = false) => {
    const token = await getToken();
    setIsLoading(true)
    try {
      const response = await fetch(`${apiUrl}/langgraph/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message, endInterview }),
      });

      if (response.ok) {
        const data = await response.json() as ChatResponse

        if (data.evaluator_scorecard) {
          setEvaluation(data.evaluator_scorecard)
        }

        if (data.message) {
          setMessages((prev) => [...prev, createMessage(data.message!, 'bot')])
        }
      } else {
        setMessages((prev) => [...prev, createMessage('Error: Failed to get response from API', 'bot')]);
      }
    } catch (err) {
      console.error("API call failed:", err);
    } finally {
      setIsLoading(false)
    }
  };

  return {
    messages,
    evaluation,
    isLoading,
    extractAndSendMessage,
    endInterview,
  }
}
