import type { Evaluation } from "./types";

interface EvaluationSummaryProps {
  evaluation: Evaluation
}

function EvaluationSummary({ evaluation } : EvaluationSummaryProps) {
  return (
    <div className="chat-intro-container h-full flex flex-col justify-center items-center text-center">
      <h2 className="heading-main">Interview Evaluation</h2>
      <ul>
        <li className="description-text">{`Overall score: ${evaluation.overall_score}`}</li>
        <li className="description-text">{`Technical score: ${evaluation.technical_competency_score}`}</li>
        <li className="description-text">{`Communication score: ${evaluation.communication_score}`}</li>
        <li className="description-text">{`Behavioral score: ${evaluation.behavioural_fit_score}`}</li>
      </ul>
      <p className="description-text">{evaluation.strengths}</p>
      <p className="description-text">{evaluation.areas_of_improvement}</p>
    </div>
  )
}

export default EvaluationSummary
