import { useState, useEffect, useRef } from 'react';
const logo = '/lovable-uploads/fac2918d-a107-444b-8ce2-b83e59b5b3c7.png';

interface LoadingScreenProps {
  onComplete: () => void;
  headerLogoRef?: React.RefObject<HTMLImageElement>;
  dataReady?: boolean;
}

const LoadingScreen = ({ onComplete, headerLogoRef }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'fading' | 'traveling' | 'done'>('loading');
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  // Progress timer
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // When progress completes, start fading blobs/dots
  useEffect(() => {
    if (progress >= 100 && phase === 'loading') {
      setTimeout(() => setPhase('fading'), 300);
    }
  }, [progress, phase]);

  // After fading, get target rect and start traveling
  useEffect(() => {
    if (phase === 'fading') {
      const timer = setTimeout(() => {
        if (headerLogoRef?.current) {
          setTargetRect(headerLogoRef.current.getBoundingClientRect());
        }
        setPhase('traveling');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [phase, headerLogoRef]);

  // After traveling animation completes, call onComplete
  useEffect(() => {
    if (phase === 'traveling') {
      const timer = setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const isFadingOrLater = phase === 'fading' || phase === 'traveling' || phase === 'done';
  const isTraveling = phase === 'traveling' || phase === 'done';

  // Calculate logo travel styles
  const getLogoStyle = (): React.CSSProperties => {
    if (isTraveling && targetRect) {
      return {
        position: 'fixed',
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.left + targetRect.width / 2,
        width: targetRect.height,
        height: targetRect.height,
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
        zIndex: 60,
      };
    }
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      width: '7rem',
      height: '7rem',
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
      zIndex: 60,
    };
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        isTraveling ? 'pointer-events-none' : ''
      }`}
      style={{ opacity: isTraveling ? 0 : 1, transition: 'opacity 0.5s ease 0.2s' }}
    >
      {/* Flowing ambient blobs */}
      <div
        className="absolute inset-0 overflow-hidden transition-opacity duration-400"
        style={{ opacity: isFadingOrLater ? 0 : 1 }}
      >
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-primary/8 blur-[100px] animate-[drift1_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 blur-[120px] animate-[drift2_10s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[500px] bg-primary/4 blur-[80px] animate-[drift3_12s_ease-in-out_infinite]" />
      </div>

      {/* Progress dots */}
      <div
        className="absolute transition-opacity duration-400"
        style={{ opacity: isFadingOrLater ? 0 : 1, top: 'calc(50% + 5rem)' }}
      >
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
    </div>
  );

  // Note: The logo is rendered below, outside the background div, 
  // so it stays visible during the travel phase
};

// We need to restructure to render the logo separately
// Let's use a wrapper approach

const LoadingScreenWrapper = ({ onComplete, headerLogoRef, dataReady = false }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'fading' | 'traveling' | 'done'>('loading');
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100 && dataReady && phase === 'loading') {
      setTimeout(() => setPhase('fading'), 300);
    }
  }, [progress, phase, dataReady]);

  useEffect(() => {
    if (phase === 'fading') {
      const timer = setTimeout(() => {
        if (headerLogoRef?.current) {
          setTargetRect(headerLogoRef.current.getBoundingClientRect());
        }
        setPhase('traveling');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [phase, headerLogoRef]);

  useEffect(() => {
    if (phase === 'traveling') {
      const timer = setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const isFadingOrLater = phase !== 'loading';
  const isTraveling = phase === 'traveling' || phase === 'done';

  const getLogoStyle = (): React.CSSProperties => {
    if (isTraveling && targetRect) {
      return {
        position: 'fixed',
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.left + targetRect.width / 2,
        width: targetRect.height,
        height: targetRect.height,
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
        zIndex: 60,
      };
    }
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      width: '7rem',
      height: '7rem',
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
      zIndex: 60,
    };
  };

  if (phase === 'done') return null;

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 z-50 bg-background"
        style={{
          opacity: isTraveling ? 0 : 1,
          transition: 'opacity 0.4s ease',
          pointerEvents: isTraveling ? 'none' : 'auto',
        }}
      >
        {/* Flowing ambient blobs */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: isFadingOrLater ? 0 : 1, transition: 'opacity 0.4s ease' }}
        >
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-primary/8 blur-[100px] animate-[drift1_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 blur-[120px] animate-[drift2_10s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[500px] bg-primary/4 blur-[80px] animate-[drift3_12s_ease-in-out_infinite]" />
        </div>

        {/* Progress dots */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: isFadingOrLater ? 0 : 1, transition: 'opacity 0.4s ease' }}
        >
          <div className="flex gap-2 items-center mt-40">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-[wave_1.4s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Logo - rendered above everything, animates from center to header */}
      <img
        src={logo}
        alt="Logo"
        className="object-contain rounded-full"
        style={{
          ...getLogoStyle(),
          filter: isTraveling
            ? 'drop-shadow(0 0 10px hsl(var(--primary) / 0.2))'
            : 'drop-shadow(0 0 30px hsl(var(--primary) / 0.3))',
        }}
      />

      {/* Breathing glow behind logo (only during loading) */}
      {!isFadingOrLater && (
        <div
          className="fixed z-[59] pointer-events-none"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute -inset-8 bg-primary/15 blur-3xl animate-[breathe_3s_ease-in-out_infinite] rounded-[40%_60%_55%_45%]" />
          <div className="absolute -inset-14 bg-primary/6 blur-[60px] animate-[breathe_4s_ease-in-out_infinite_0.5s] rounded-[55%_45%_50%_50%]" />
        </div>
      )}
    </>
  );
};

export default LoadingScreenWrapper;
