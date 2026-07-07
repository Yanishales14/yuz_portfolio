import { motion } from 'framer-motion';
import { useInView } from '../hooks/useAnimations';
import { usePortfolio } from '../hooks/usePortfolio';

export function FilmStrip() {
  const { projects } = usePortfolio();
  const { ref, isInView } = useInView(0.1);

  if (projects.length === 0) return null;

  const stripItems = [...projects, ...projects, ...projects];

  return (
    <section className="py-12 overflow-hidden" ref={ref}>
      <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }}>
        <div className="bg-card border-y border-border py-3">
          {/* Top sprocket holes */}
          <div className="overflow-hidden mb-2">
            <div className="flex animate-film-strip" style={{ width: 'max-content' }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={`top-${i}`} className="flex-shrink-0 flex justify-around px-4" style={{ width: '180px' }}>
                  <div className="w-3 h-3 rounded-[2px] bg-muted-foreground/10" />
                  <div className="w-3 h-3 rounded-[2px] bg-muted-foreground/10" />
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="overflow-hidden">
            <div className="flex animate-film-strip" style={{ width: 'max-content' }}>
              {stripItems.map((project, i) => (
                <div key={`thumb-${project.id}-${i}`} className="flex-shrink-0 mx-1.5">
                  <div className="aspect-video rounded-md overflow-hidden" style={{ width: '180px' }}>
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-secondary to-muted" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom sprocket holes */}
          <div className="overflow-hidden mt-2">
            <div className="flex animate-film-strip" style={{ width: 'max-content' }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={`bot-${i}`} className="flex-shrink-0 flex justify-around px-4" style={{ width: '180px' }}>
                  <div className="w-3 h-3 rounded-[2px] bg-muted-foreground/10" />
                  <div className="w-3 h-3 rounded-[2px] bg-muted-foreground/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
