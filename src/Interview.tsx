import { useChatMessages } from './hooks/useChatMessages';
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
import ChatIntro from './ChatIntro'
import EvaluationSummary from './EvaluationSummary'
import Header from './Header'

function Interview() {
  const { messages, evaluation, isLoading, extractAndSendMessage, endInterview } = useChatMessages()

  function selectContent() {
    if (evaluation) {
      return <EvaluationSummary evaluation={evaluation} />
    }

    if (messages.length === 0 && !isLoading) {
      return <ChatIntro />
    }

    return <ChatHistory messages={messages} isLoading={isLoading} />
  }

  return (
    <div className="chat-container h-screen flex flex-col [&::-webkit-scrollbar]:hidden pb-[env(safe-area-inset-bottom)]">
      <Header />
      {selectContent()}
      {!evaluation && <ChatInput onSendMessage={extractAndSendMessage} onStop={endInterview} isLoading={isLoading} />}
    </div>
  )
}

export default Interview
