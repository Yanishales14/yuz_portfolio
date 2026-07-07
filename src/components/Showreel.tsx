import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useInView } from '../hooks/useAnimations';

export function Showreel() {
  const { showreelVideoUrl, showreelThumbnailUrl } = usePortfolio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: sectionRef, isInView } = useInView(0.2);

  const handlePlay = () => {
    setIsPlaying(true);
    setTimeout(() => {
      videoRef.current?.play();
    }, 100);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (!showreelVideoUrl) return null;

  return (
    <section id="showreel" className="py-28 px-6 lg:px-8" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-sm font-medium text-muted-foreground tracking-[0.2em] uppercase mb-4 block">
            Featured Work
          </span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-4xl md:text-5xl font-bold tracking-tight">
            Showreel
          </h2>
        </motion.div>

        <motion.div
          className="relative group"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Ambient blurred background */}
          {showreelThumbnailUrl && (
            <div className="absolute -inset-8 opacity-20 blur-3xl scale-95 rounded-[3rem] overflow-hidden pointer-events-none">
              <img src={showreelThumbnailUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Video container */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black aspect-video">
            {!isPlaying ? (
              <>
                {/* Thumbnail with play button */}
                {showreelThumbnailUrl && (
                  <img src={showreelThumbnailUrl} alt="Showreel" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/30 cursor-pointer flex items-center justify-center group-hover:bg-black/40 transition-colors duration-300" onClick={handlePlay}>
                  <motion.button
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Play showreel"
                  >
                    <Play size={32} className="text-foreground ml-1" fill="currentColor" />
                  </motion.button>
                </div>
              </>
            ) : (
              <video
                ref={videoRef}
                src={showreelVideoUrl}
                className="w-full h-full object-contain bg-black"
                controls={false}
                muted={isMuted}
                playsInline
                loop
                onClick={() => {
                  if (videoRef.current?.paused) {
                    videoRef.current.play();
                  } else {
                    videoRef.current?.pause();
                  }
                }}
              />
            )}

            {/* Live label */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-lg px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-xs font-medium tracking-wide">SHOWREEL</span>
              </div>
            </div>

            {/* Controls */}
            {isPlaying && (
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
