import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useAnimations';
import { usePortfolio } from '../hooks/usePortfolio';

export function FilmStrip() {
  const { projects, isLoaded } = usePortfolio();
  const { ref, isInView } = useInView(0.1);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const hasProjects = projects.length > 0;

  // Duplicate enough for seamless infinite loop
  const duplicates = hasProjects ? Math.max(8, Math.ceil(20 / projects.length)) : 1;
  const stripItems = hasProjects ? [...Array(duplicates)].flatMap(() => projects) : [];

  // Placeholder items for when no projects exist yet
  const placeholderCount = 12;

  // Dynamic animation duration
  useEffect(() => {
    if (scrollerRef.current && hasProjects) {
      const totalWidth = scrollerRef.current.scrollWidth;
      const duration = totalWidth / 100;
      scrollerRef.current.style.setProperty('--film-duration', `${duration}s`);
    }
  }, [projects, isLoaded]);

  return (
    <section className="overflow-hidden" ref={ref}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-card border-y border-border relative">

          {/* Film grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Top sprocket holes row */}
          <div className="overflow-hidden border-b border-border/50">
            <div className="flex animate-film-strip" style={{ width: 'max-content' }}>
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={`top-${i}`} className="flex-shrink-0 flex justify-around items-center px-2" style={{ width: '200px' }}>
                  <div className="w-4 h-4 rounded-[3px] bg-muted-foreground/8 border border-muted-foreground/5" />
                  <div className="w-4 h-4 rounded-[3px] bg-muted-foreground/8 border border-muted-foreground/5" />
                  <div className="w-4 h-4 rounded-[3px] bg-muted-foreground/8 border border-muted-foreground/5" />
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail strip — real projects or placeholders */}
          <div className="overflow-hidden py-3">
            <div
              ref={scrollerRef}
              className="flex animate-film-strip"
              style={{ width: 'max-content', animationDuration: 'var(--film-duration, 40s)' }}
            >
              {hasProjects ? (
                stripItems.map((project, i) => (
                  <div key={`thumb-${project.id}-${i}`} className="flex-shrink-0 mx-1.5 group">
                    <div className="aspect-video rounded-md overflow-hidden border border-border/50 shadow-sm relative" style={{ width: '200px' }}>
                      {project.thumbnailUrl ? (
                        <img
                          src={project.thumbnailUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                          <svg className="w-8 h-8 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/50 text-white/60 text-[9px] font-mono rounded backdrop-blur-sm">
                        {String(i % projects.length + 1).padStart(2, '0')}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                Array.from({ length: placeholderCount }).map((_, i) => (
                  <div key={`placeholder-${i}`} className="flex-shrink-0 mx-1.5">
                    <div className="aspect-video rounded-md overflow-hidden border border-border/50 bg-gradient-to-br from-secondary via-muted/50 to-secondary relative" style={{ width: '200px' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-muted-foreground/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/30 text-white/30 text-[9px] font-mono rounded">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom sprocket holes row */}
          <div className="overflow-hidden border-t border-border/50">
            <div className="flex animate-film-strip" style={{ width: 'max-content' }}>
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={`bot-${i}`} className="flex-shrink-0 flex justify-around items-center px-2" style={{ width: '200px' }}>
                  <div className="w-4 h-4 rounded-[3px] bg-muted-foreground/8 border border-muted-foreground/5" />
                  <div className="w-4 h-4 rounded-[3px] bg-muted-foreground/8 border border-muted-foreground/5" />
                  <div className="w-4 h-4 rounded-[3px] bg-muted-foreground/8 border border-muted-foreground/5" />
                </div>
              ))}
            </div>
          </div>

          {/* Side fade edges */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-card to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-card to-transparent z-20 pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
}
