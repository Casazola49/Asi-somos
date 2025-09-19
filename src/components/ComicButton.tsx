
import React from 'react';

interface ComicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: 'yellow' | 'fuchsia';
}

const ComicButton: React.FC<ComicButtonProps> = ({ children, color = 'yellow', ...props }) => {
  const colorClasses = {
    yellow: 'bg-yellow-400 hover:bg-yellow-500',
    fuchsia: 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white',
  };

  return (
    <button
      className={`font-bold text-xl md:text-2xl py-4 px-8 rounded-lg border-4 border-black transform transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] ${colorClasses[color]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ComicButton;
