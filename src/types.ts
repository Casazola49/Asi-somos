
export type UserMode = 'individual' | 'couple' | null;
export type QuizState = 'welcome' | 'quiz' | 'analyzing' | 'results';

export interface Question {
  question: string;
  options: string[];
}

export interface RelationshipProfile {
  title: string;
  description: string;
  compatibilityTips: string;
}
