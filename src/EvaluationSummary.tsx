import type { Evaluation } from "./types";

interface EvaluationSummaryProps {
  evaluation: Evaluation
}

interface EvaluationScoreProps {
  type: string
  score: number
}

interface EvaluationDetailProps {
  title: string
  subtitle: string
  detail: string
}

function EvaluationScore({ type, score } : EvaluationScoreProps) {
  return (
    <div className="flex gap-2 justify-center items-center">
      <p className="w-40 text-right">{type}</p>
      <progress className="flex-1 w-48 h-3 rounded-lg overflow-hidden appearance-none
          [&::-webkit-progress-bar]:bg-gray-700
          [&::-webkit-progress-value]:bg-emerald-500
          [&::-moz-progress-bar]:bg-emerald-500" value={score} max={5} />
    </div>
  )
}

function EvaluationDetail({ title, subtitle, detail } : EvaluationDetailProps) {
  return (
    <div className="content-box p-1 flex-1 text-left">
      <div className="w-full px-3">
        <h2 className="content-title">{title}</h2>
        <h3 className="content-subtitle">{subtitle}</h3>
      </div>
      <p className="description-text">{detail}</p>
    </div>
  )
}

function EvaluationSummary({ evaluation } : EvaluationSummaryProps) {
  return (
    <div className="chat-intro-container h-full flex flex-col justify-center items-center text-center">
      <h2 className="heading-main">Interview Evaluation</h2>
      <EvaluationScore type="Overall" score={evaluation.overall_score} />
      <EvaluationScore type="Technical" score={evaluation.technical_competency_score} />
      <EvaluationScore type="Communication" score={evaluation.communication_score} />
      <EvaluationScore type="Behavioral" score={evaluation.behavioural_fit_score} />
      <div className="flex gap-5 m-5">
        <EvaluationDetail title="Strengths" subtitle="What you did well during the interview" detail={evaluation.strengths} />
        <EvaluationDetail title="Areas for Improvement" subtitle="Suggestions to enhance your interview performance" detail={evaluation.areas_of_improvement} />
      </div>
    </div>
  )
}

export default EvaluationSummary
