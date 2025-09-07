import { useChatMessages } from './hooks/useChatMessages';
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
import ChatIntro from './ChatIntro'
import Header from './Header'

function Interview() {
  const { messages, isLoading, extractAndSendMessage, endInterview } = useChatMessages();
  return (
    <div className="chat-container h-screen flex flex-col [&::-webkit-scrollbar]:hidden pb-[env(safe-area-inset-bottom)]">
      <Header />
      {messages.length === 0 && !isLoading ? (
        <ChatIntro />
      ) : (
        <ChatHistory messages={messages} isLoading={isLoading} />
      )
      }
      <ChatInput onSendMessage={extractAndSendMessage} onStop={endInterview} isLoading={isLoading} />
    </div>
  )
}

export default Interview
