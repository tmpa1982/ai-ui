import { useEffect, useState } from 'react'
import { useChatMessages } from './hooks/useChatMessages';
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
import ChatIntro from './ChatIntro'
import EvaluationSummary from './EvaluationSummary'
import Header from './Header'
import InterviewSetup from './InterviewSetup'
import { InterviewStage } from './types'

function Interview() {
  const [stage, setStage] = useState(InterviewStage.Setup)
  const { messages, evaluation, isLoading, extractAndSendMessage, endInterview } = useChatMessages()

  useEffect(() => {
    if (evaluation) {
      setStage(InterviewStage.Evaluation)
      return
    }

    if (messages.length !== 0) {
      setStage(InterviewStage.Interview)
      return
    }
  }, [evaluation, messages])

  function selectContent() {
    switch (stage) {
      case InterviewStage.Setup: return <InterviewSetup onSubmit={() => setStage(InterviewStage.Intro)} />
      case InterviewStage.Intro: return <ChatIntro />
      case InterviewStage.Interview: return <ChatHistory messages={messages} isLoading={isLoading} />
      case InterviewStage.Evaluation: return <EvaluationSummary evaluation={evaluation!} />
    }
  }

  const showChat = stage === InterviewStage.Interview || stage === InterviewStage.Intro
  return (
    <div className="chat-container h-screen flex flex-col [&::-webkit-scrollbar]:hidden pb-[env(safe-area-inset-bottom)]">
      <Header />
      <div className="flex-1 overflow-y-visible bg-gray-900">
        {selectContent()}
      </div>
      {showChat && <ChatInput onSendMessage={extractAndSendMessage} onStop={endInterview} isLoading={isLoading} />}
    </div>
  )
}

export default Interview
