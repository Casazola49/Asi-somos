import React, { useState, useEffect, useCallback } from 'react';
import type { Question, UserMode } from '../types';
import { fetchQuestions } from '../services/geminiService';
import LoadingIndicator from './LoadingIndicator';

interface QuizScreenProps {
  mode: UserMode;
  onSubmit: (answers: string[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ mode, onSubmit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedQuestions = await fetchQuestions(mode);
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
      } else {
        setError('No se pudieron cargar las preguntas. Intenta de nuevo.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setIsLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onSubmit(newAnswers);
    }
  };
  
  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex) / questions.length) * 100 : 0;

  if (isLoading) {
    return <LoadingIndicator message="Generando preguntas personalizadas..." />;
  }

  if (error) {
    return (
      <div className="text-center bg-white p-8 rounded-lg border-4 border-black">
        <h3 className="text-2xl font-bold text-black">¡Oh no!</h3>
        <p className="text-black">{error}</p>
        <button onClick={loadQuestions} className="mt-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg border-2 border-black">
          Reintentar
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="w-full bg-gray-300 rounded-full h-4 border-2 border-black mb-6">
            <div 
                className="bg-fuchsia-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}>
            </div>
        </div>

        <div className="bg-white p-8 rounded-lg border-4 border-black shadow-[10px_10px_0px_#D9006C]">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-black" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className="w-full text-left p-4 bg-yellow-300 rounded-md border-2 border-black font-semibold text-lg text-black hover:bg-yellow-400 transform hover:scale-105 transition-transform"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default QuizScreen;