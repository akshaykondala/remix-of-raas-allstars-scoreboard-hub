import { useState, useEffect } from 'react';
import logo from '../../public/lovable-uploads/fac2918d-a107-444b-8ce2-b83e59b5b3c7.png';

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 600);
          }, 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
      </div>

      {/* Logo */}
      <div className="relative mb-8">
        {/* Rotating ring */}
        <div className="absolute -inset-6 rounded-full border border-primary/20 animate-[spin_4s_linear_infinite]" />
        <div className="absolute -inset-10 rounded-full border border-primary/10 animate-[spin_6s_linear_infinite_reverse]" />

        {/* Logo with pulse glow */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <img
            src={logo}
            alt="Logo"
            className="relative w-24 h-24 object-contain rounded-full animate-[pulse_2s_ease-in-out_infinite]"
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-150 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Loading text */}
      <p className="mt-4 text-xs text-muted-foreground tracking-[0.3em] uppercase">
        Loading
      </p>
    </div>
  );
};

export default LoadingScreen;
