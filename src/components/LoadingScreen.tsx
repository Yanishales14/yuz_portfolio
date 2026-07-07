import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<'countdown' | 'reveal' | 'done'>('countdown');

  useEffect(() => {
    const duration = 2200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      setCount(Math.round(eased * 100));

      if (progress >= 1) {
        setPhase('reveal');
        setTimeout(() => {
          setPhase('done');
          onComplete();
        }, 500);
        return;
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle grain texture */}
          <div className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]"
            style={{ background: 'radial-gradient(circle, var(--foreground) 0%, transparent 70%)' }}
          />

          <div className="relative flex flex-col items-center gap-12">
            {/* Circular progress */}
            <motion.div
              className="relative w-32 h-32"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="rgba(0,0,0,0.04)"
                  strokeWidth="1"
                />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="var(--foreground)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * count / 100)}
                  className="transition-all duration-75 ease-linear"
                />
              </svg>

              {/* Counter */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-3xl font-semibold tabular-nums tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {count}
                </span>
              </div>
            </motion.div>

            {/* Logo/Name */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1
                className="text-2xl font-bold tracking-[-0.03em] mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                YUZ<span className="font-light text-muted-foreground">Studio</span>
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-[0.4em] uppercase">
                Video Editor & Storyteller
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-48 h-[2px] bg-secondary rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-foreground rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${count}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>

            {/* Reveal overlay */}
            {phase === 'reveal' && (
              <motion.div
                className="absolute inset-0 bg-background z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
