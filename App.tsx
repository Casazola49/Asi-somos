import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import LoadingIndicator from './components/LoadingIndicator';
import { analyzeAnswers } from './services/geminiService';
import type { UserMode, QuizState, RelationshipProfile } from './types';

const App: React.FC = () => {
  const [userMode, setUserMode] = useState<UserMode>(null);
  const [quizState, setQuizState] = useState<QuizState>('welcome');
  const [results, setResults] = useState<RelationshipProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleModeSelect = (mode: UserMode) => {
    setUserMode(mode);
    setQuizState('quiz');
    setError(null);
    setResults(null);
  };

  const handleQuizSubmit = useCallback(async (answers: string[]) => {
    setQuizState('analyzing');
    setError(null);
    try {
      if (!userMode) throw new Error("User mode not set");
      const profile = await analyzeAnswers(userMode, answers);
      setResults(profile);
      setQuizState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
      // Fallback to welcome screen on error
      setQuizState('welcome');
    }
  }, [userMode]);

  const handleReset = () => {
    setUserMode(null);
    setQuizState('welcome');
    setResults(null);
    setError(null);
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center bg-red-100 p-8 rounded-lg border-4 border-black">
          <h3 className="text-2xl font-bold text-black">¡Ups! Algo salió mal</h3>
          <p className="my-4 text-black">{error}</p>
          <button onClick={handleReset} className="mt-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg border-2 border-black">
            Volver al inicio
          </button>
        </div>
      );
    }

    switch (quizState) {
      case 'quiz':
        return <QuizScreen mode={userMode} onSubmit={handleQuizSubmit} />;
      case 'analyzing':
        return <LoadingIndicator message="Analizando tus respuestas..." />;
      case 'results':
        return results ? <ResultsScreen profile={results} onReset={handleReset} /> : <WelcomeScreen onSelectMode={handleModeSelect} />;
      case 'welcome':
      default:
        return <WelcomeScreen onSelectMode={handleModeSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-fuchsia-500 bg-cover bg-center flex flex-col items-center p-4" style={{backgroundImage: "radial-gradient(circle, #fde047 10%, transparent 10%), radial-gradient(circle, #fde047 10%, transparent 10%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px"}}>
       <div className="w-full h-full min-h-screen bg-fuchsia-500/80 absolute top-0 left-0 z-0"></div>
       <div className="relative z-10 w-full flex flex-col items-center min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center w-full px-4">
                {renderContent()}
            </main>
       </div>
    </div>
  );
};

export default App;