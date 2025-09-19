import React from 'react';
import type { UserMode } from '../types';
import ComicButton from './ComicButton';

interface WelcomeScreenProps {
  onSelectMode: (mode: UserMode) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="bg-white/90 p-10 rounded-xl border-4 border-black shadow-[10px_10px_0px_#fde047]">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">¡Descubre tu tipo de relación!</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl text-black">
          ¿Estás solo/a o en pareja? Responde unas preguntas y nuestra IA te ayudará a entender qué buscas o cómo mejorar tu relación actual.
        </p>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="text-center">
            <ComicButton onClick={() => onSelectMode('individual')} color="yellow">
              PARA MÍ
            </ComicButton>
            <p className="text-base mt-3 text-black max-w-[200px] mx-auto">
              Ideal si estás soltero/a o quieres explorar tu lado personal.
            </p>
          </div>
          <div className="text-center">
            <ComicButton onClick={() => onSelectMode('couple')} color="fuchsia">
              PARA NOSOTROS
            </ComicButton>
            <p className="text-base mt-3 text-black max-w-[200px] mx-auto">
              Perfecto para parejas que buscan crecer y entenderse mejor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;