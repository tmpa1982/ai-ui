import { useState, useEffect, useRef } from 'react'
import './App.css'
import { useMsal, useAccount, useIsAuthenticated } from "@azure/msal-react";
import { apiRequest, loginRequest } from "./msalConfig";
import { MessageCircle, Send, LogOut, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';


// Types
export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export type UserData = {
  name: string;
  email: string;
};

function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount(accounts[0] || {});

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when authenticated
  useEffect(() => {
    if (isAuthenticated && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAuthenticated]);

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
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Add success animation to send button
    const sendButton = document.querySelector('.send-button');
    if (sendButton) {
      sendButton.classList.add('success');
      setTimeout(() => {
        sendButton.classList.remove('success');
      }, 600);
    }

    try {
      const token = await getToken();
      const apiUrl: string = import.meta.env.VITE_API_URL || 'https://tran-llm-daatfkc6hhf0a8hf.southeastasia-01.azurewebsites.net';
      
      console.log('Making API call to:', `${apiUrl}/langgraph/question`);
      console.log('Request payload:', { message: message.trim() });
      
      const response = await fetch(`${apiUrl}/langgraph/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.text();
        console.log('Response data:', data);
        
        // Remove quotation marks from the beginning and end of the response
        const cleanData = data.replace(/^["']|["']$/g, '');
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: cleanData || 'No response received',
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        console.error('Response status:', response.status);
        
        let errorMessage = 'Error: Failed to get response from API';
        if (response.status === 401) {
          errorMessage = 'Error: Authentication failed. Please try logging in again.';
        } else if (response.status === 403) {
          errorMessage = 'Error: Access denied. Check your permissions.';
        } else if (response.status === 404) {
          errorMessage = 'Error: API endpoint not found. Please check the URL.';
        } else if (response.status === 500) {
          errorMessage = 'Error: Server error. Please try again later.';
        } else if (response.status >= 400) {
          errorMessage = `Error: Request failed (${response.status}). ${errorText || ''}`;
        }
        
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: errorMessage,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (err) {
      console.error("API call failed:", err);
      let errorMessage = 'Error: Failed to connect to the server';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Error: Network error. Please check your internet connection.';
      } else if (err instanceof Error) {
        errorMessage = `Error: ${err.message}`;
      }
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };



  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-content">
            <div className="login-icon">
              <MessageCircle className="icon-large" />
            </div>
            <h1 className="login-title">
              Interview Agent
            </h1>
            <p className="login-description">
              Sign in to start chatting with our AI-powered assistant
            </p>
            <button 
              onClick={() => instance.loginPopup(loginRequest)} 
              className="btn-primary login-button"
            >
              Sign In with Microsoft
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-wrapper">
        {/* Header */}
        <div className="app-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <MessageCircle className="icon-medium" />
              </div>
              <div>
                <h1 className="header-title">
                  Interview Agent
                </h1>
                <p className="header-subtitle">
                  Welcome, {account?.name || account?.username || 'User'}
                </p>
                <p className="header-debug">
                  API: {import.meta.env.VITE_API_URL || 'https://tran-llm-daatfkc6hhf0a8hf.southeastasia-01.azurewebsites.net'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              <LogOut className="icon-small" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="chat-container">
          {/* Messages */}
          <div className="messages-area">
            {messages.length === 0 && (
              <div className="welcome-message">
                <div className="welcome-icon">
                  <Bot className="icon-large" />
                </div>
                <h3 className="welcome-title">
                  Start a conversation
                </h3>
                <p className="welcome-description">
                  Ask me anything! I'm here to help with your questions and provide assistance.
                </p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
              >
                <div className="message-content">
                  <div className={`message-avatar ${message.sender === 'user' ? 'avatar-user' : 'avatar-bot'}`}>
                    {message.sender === 'user' ? (
                      <User className="icon-small" />
                    ) : (
                      <Bot className="icon-small" />
                    )}
                  </div>
                  <div className={`message-bubble ${message.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
                    <div className="message-text">
                      {message.sender === 'user' ? (
                        <p>{message.text}</p>
                      ) : (
                        <>
                          {console.log('Bot message text:', message.text)}
                          <ReactMarkdown>{message.text.replace(/\\n/g, '\n')}</ReactMarkdown>
                        </>
                      )}
                    </div>
                    <p className={`message-time ${message.sender === 'user' ? 'time-user' : 'time-bot'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message-wrapper message-bot">
                <div className="message-content">
                  <div className="message-avatar avatar-bot">
                    <Bot className="icon-small" />
                  </div>
                  <div className="message-bubble bubble-bot">
                    <div className="loading-indicator">
                      <Loader2 className="icon-small loading-spin" />
                      <span className="loading-text">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <div className="input-wrapper">
              <div className="input-container">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  className="message-input"
                />
                <div className="char-counter">
                  {input.length > 0 && `${input.length} chars`}
                </div>
              </div>
                             <div className="send-button-container">
                 <button
                   onClick={() => sendMessage(input)}
                   disabled={!input.trim() || isLoading}
                   className={`send-button ${isLoading ? 'loading' : ''}`}
                   tabIndex={0}
                   aria-label={isLoading ? 'Sending message...' : 'Send message'}
                   type="button"
                 >
                   {isLoading ? (
                     <Loader2 className="icon-medium loading-spin" />
                   ) : (
                     <Send className="icon-medium" />
                   )}
                 </button>
               </div>
            </div>
            <p className="input-hint">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
