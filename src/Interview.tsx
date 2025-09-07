import { useChatMessages } from './hooks/useChatMessages';
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
import ChatIntro from './ChatIntro'
import Header from './Header'

function Interview() {
  const { messages, isLoading, extractAndSendMessage } = useChatMessages();
  return (
    <div className="chat-container h-screen flex flex-col [&::-webkit-scrollbar]:hidden">
      <Header />
      {messages.length === 0 && !isLoading ? (
        <ChatIntro />
      ) : (
        <ChatHistory messages={messages} isLoading={isLoading} />
      )
      }
      <ChatInput onSendMessage={extractAndSendMessage} isLoading={isLoading} />
    </div>
  )
}

export default Interview
