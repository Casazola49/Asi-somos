
import React from 'react';
import type { RelationshipProfile } from '../types';
import ComicButton from './ComicButton';

interface ResultsScreenProps {
  profile: RelationshipProfile;
  onReset: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ profile, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg border-4 border-black shadow-[12px_12px_0px_#fde047]">
       <div className="text-center mb-6">
         <h2 className="font-bangers text-5xl md:text-6xl text-fuchsia-500 tracking-wide" style={{ WebkitTextStroke: '2px black' }}>
           ¡Tu resultado!
         </h2>
       </div>
       
       <div className="comic-panel p-6 bg-fuchsia-100 border-2 border-dashed border-black rounded-lg mb-6">
         <h3 className="text-3xl font-bold mb-3 text-black">{profile.title}</h3>
         <p className="text-lg leading-relaxed text-black">{profile.description}</p>
       </div>

       <div className="comic-panel p-6 bg-yellow-100 border-2 border-dashed border-black rounded-lg mb-8">
         <h3 className="text-3xl font-bold mb-3 text-black">Consejos de Compatibilidad</h3>
         <p className="text-lg leading-relaxed text-black">{profile.compatibilityTips}</p>
       </div>
       
       <div className="text-center">
         <ComicButton onClick={onReset} color="yellow">
            EMPEZAR DE NUEVO
         </ComicButton>
       </div>
    </div>
  );
};

export default ResultsScreen;
