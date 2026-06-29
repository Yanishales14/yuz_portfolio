import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<'countdown' | 'reveal' | 'done'>('countdown');

  useEffect(() => {
    const duration = 2000; // 2 seconds loading
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out the counter
      const eased = 1 - Math.pow(1 - progress, 2);
      setCount(Math.round(eased * 100));

      if (progress >= 1) {
        setPhase('reveal');
        setTimeout(() => {
          setPhase('done');
          onComplete();
        }, 600);
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
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle grain texture */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative flex flex-col items-center gap-10">
            {/* Circular progress */}
            <motion.div
              className="relative w-28 h-28"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="rgba(0,0,0,0.05)"
                  strokeWidth="1.5"
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
                  className="text-2xl font-semibold tabular-nums"
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
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1
                className="text-xl font-bold tracking-[-0.02em] mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Studio
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
                Video Editor & Storyteller
              </p>
            </motion.div>

            {/* Progress dots */}
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: count > (i + 1) * 20 ? 'var(--foreground)' : 'rgba(0,0,0,0.08)',
                  }}
                />
              ))}
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
