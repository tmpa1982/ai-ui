export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export type ChatResponse = {
  message: string | null;
  evaluator_scorecard: Evaluation | null;
}

export type Evaluation = {
  communication_score: number;
  technical_competency_score: number;
  behavioural_fit_score: number;
  overall_score: number;
  strengths: string;
  areas_of_improvement: string;
}
