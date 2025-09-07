import { useChatMessages } from './hooks/useChatMessages';
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
import Header from './Header'

function Interview() {
  const { messages, isLoading, extractAndSendMessage } = useChatMessages();
  return (
    <div className="chat-container h-screen flex flex-col [&::-webkit-scrollbar]:hidden">
      <Header />
      <ChatHistory messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={extractAndSendMessage} isLoading={isLoading} />
    </div>
  )
}

export default Interview
