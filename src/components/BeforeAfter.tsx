import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useAnimations';

export function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const isDragging = useRef(false);
  const { ref, isInView } = useInView(0.2);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section className="py-28 px-6 lg:px-8 bg-card" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-sm font-medium text-muted-foreground tracking-[0.2em] uppercase mb-4 block">
            Color Grading
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Before & After
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Drag the slider to see the transformative power of professional color grading.
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            ref={containerRef}
            className="relative rounded-3xl overflow-hidden shadow-xl border border-border aspect-video cursor-ew-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleMouseDown}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            role="slider"
            aria-label="Before and after comparison slider"
            aria-valuenow={Math.round(sliderPos)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {/* After (color graded) */}
            <img
              src="https://images.unsplash.com/photo-1478860409698-8707f313ee8b?w=1200&h=675&fit=crop"
              alt="After color grading"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />

            {/* Before (RAW) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1478860409698-8707f313ee8b?w=1200&h=675&fit=crop"
                alt="Before color grading (RAW footage)"
                className="absolute inset-0 object-cover"
                style={{
                  filter: 'saturate(0.3) brightness(0.75) contrast(0.85) sepia(0.15)',
                  width: containerWidth ? `${containerWidth}px` : '100%',
                  height: '100%',
                }}
                draggable={false}
              />
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 z-10"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-[2px] h-full bg-white/80 shadow-lg mx-auto" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center border border-white/50">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 4L3 10L7 16" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 4L17 10L13 16" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-md text-white text-xs font-medium rounded-lg z-20">
              RAW
            </div>
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-md text-white text-xs font-medium rounded-lg z-20">
              Color Graded
            </div>
          </div>
        </motion.div>

        {/* Audio Waveform Animation */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-center text-sm font-medium text-muted-foreground tracking-wide uppercase mb-6">
            Audio Waveform
          </p>
          <div className="flex items-center justify-center gap-[3px] h-16" role="img" aria-label="Audio waveform visualization">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-[3px] bg-foreground/15 rounded-full origin-bottom"
                animate={{
                  scaleY: [0.3, 0.3 + Math.random() * 0.7, 0.3],
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.6,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: i * 0.03,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
