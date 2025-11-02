import { useMemo, useState } from 'react'
import { useChatMessages } from './hooks/useChatMessages'
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
import ChatIntro from './ChatIntro'
import EvaluationSummary from './EvaluationSummary'
import Header from './Header'
import InterviewSetup from './InterviewSetup'
import { InterviewStage } from './types'

function Interview() {
  const [manualStage, setManualStage] = useState(InterviewStage.Setup)
  const { messages, evaluation, isLoading, extractAndSendMessage, endInterview } = useChatMessages()

  const stage = useMemo(() => {
    if (evaluation) return InterviewStage.Evaluation
    if (messages.length !== 0) return InterviewStage.Interview
    return manualStage
  }, [manualStage, evaluation, messages])

  function selectContent() {
    switch (stage) {
      case InterviewStage.Setup: return <InterviewSetup onSubmit={() => setManualStage(InterviewStage.Intro)} />
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
