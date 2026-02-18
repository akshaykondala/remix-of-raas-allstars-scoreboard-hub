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
      {/* Flowing ambient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-primary/8 blur-[100px] animate-[drift1_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 blur-[120px] animate-[drift2_10s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[500px] bg-primary/4 blur-[80px] animate-[drift3_12s_ease-in-out_infinite]" />
      </div>

      {/* Logo */}
      <div className="relative mb-10">
        {/* Soft breathing glow */}
        <div className="absolute -inset-8 bg-primary/15 blur-3xl animate-[breathe_3s_ease-in-out_infinite] rounded-[40%_60%_55%_45%]" />
        <div className="absolute -inset-14 bg-primary/6 blur-[60px] animate-[breathe_4s_ease-in-out_infinite_0.5s] rounded-[55%_45%_50%_50%]" />

        <div className="relative overflow-hidden rounded-full">
          <img
            src={logo}
            alt="Logo"
            className="relative w-28 h-28 object-contain rounded-full animate-[float_3s_ease-in-out_infinite] drop-shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
          />
          {/* Shine sweep */}
          <div className="absolute inset-0 rounded-full animate-[shine_3s_ease-in-out_infinite_1s]"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.25) 55%, transparent 60%)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-[wave_1.4s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
