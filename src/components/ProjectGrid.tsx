import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Clock, User, Wrench, Volume2, VolumeX } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useInView } from '../hooks/useAnimations';
import type { Project } from '../models/types';

const categories = [
  { key: 'all' as const, label: 'All' },
  { key: 'commercial' as const, label: 'Commercial' },
  { key: 'documentary' as const, label: 'Documentary' },
  { key: 'music' as const, label: 'Music Video' },
  { key: 'corporate' as const, label: 'Corporate' },
  { key: 'short' as const, label: 'Short Film' },
];

export function ProjectGrid() {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'commercial' | 'documentary' | 'music' | 'corporate' | 'short'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { ref, isInView } = useInView(0.1);

  const activeCategories = ['all', ...new Set(projects.map(p => p.category))];
  const filteredProjects = selectedCategory === 'all' ? projects : projects.filter(p => p.category === selectedCategory);

  if (projects.length === 0) return null;

  return (
    <section id="work" className="py-28 px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="mb-12" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <span className="text-sm font-medium text-muted-foreground tracking-[0.2em] uppercase mb-4 block">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Featured Work</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">A curated selection of recent projects across commercial, documentary, and creative filmmaking.</p>
        </motion.div>

        <motion.div className="flex flex-wrap gap-2 mb-12" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
          {categories.filter(c => activeCategories.includes(c.key)).map((cat) => (
            <button key={cat.key} onClick={() => setSelectedCategory(cat.key)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${selectedCategory === cat.key ? 'bg-foreground text-background shadow-md' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {cat.label}
            </button>
          ))}
        </motion.div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div key={project.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
                <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const thumbnail = project.thumbnailUrl;

  return (
    <div className="group cursor-pointer" onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary border border-border mb-4 shadow-md group-hover:shadow-xl transition-all duration-500">
        {thumbnail ? (
          <img src={thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <Play size={32} className="text-muted-foreground/30" />
          </div>
        )}
        <motion.div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3 }}>
          <motion.div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: isHovered ? 1 : 0.5, opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <Play size={22} className="text-foreground ml-0.5" fill="currentColor" />
          </motion.div>
        </motion.div>
        {project.duration && <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-lg text-xs font-medium">{project.duration}</div>}
        <div className="absolute top-3 left-3"><span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-foreground rounded-lg text-xs font-medium capitalize">{project.category}</span></div>
      </div>
      <div className="px-1">
        <div className="flex items-center gap-2 mb-1.5">
          {project.client && <><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{project.client}</span><span className="text-muted-foreground/40">•</span></>}
          <span className="text-xs text-muted-foreground">{project.year}</span>
        </div>
        <h3 className="text-lg font-bold group-hover:text-muted-foreground transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{project.title}</h3>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const hasVideo = !!project.videoUrl;

  // Start muted autoplay when modal opens and video loads
  const handleCanPlay = () => {
    if (!hasVideo || !videoRef.current || hasStarted) return;
    videoRef.current.play().then(() => {
      setHasStarted(true);
      setIsPlaying(true);
    }).catch(() => {
      // Autoplay blocked — user must click play
      setIsPlaying(false);
    });
  };

  // User clicks the big play button
  const handlePlayClick = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
    videoRef.current.play().then(() => {
      setHasStarted(true);
      setIsPlaying(true);
    }).catch(() => {});
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Pause on unmount
  useEffect(() => {
    return () => { videoRef.current?.pause(); };
  }, []);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-3xl overflow-hidden shadow-2xl overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors" aria-label="Close"><X size={18} /></button>

        <div className="aspect-video bg-black relative">
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                src={project.videoUrl}
                className="w-full h-full object-contain"
                controls={hasStarted}
                muted={isMuted}
                playsInline
                preload="auto"
                poster={project.thumbnailUrl}
                onCanPlay={handleCanPlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Mute/unmute button when playing */}
              {hasStarted && isPlaying && (
                <button onClick={toggleMute} className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              )}

              {/* Big play button overlay — shown before video starts or when paused without native controls */}
              {!hasStarted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 cursor-pointer z-10" onClick={handlePlayClick}>
                  <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                    <Play size={32} className="text-foreground ml-1" fill="currentColor" />
                  </div>
                  <p className="text-white/70 text-sm mt-4">Click to play</p>
                </div>
              )}
            </>
          ) : project.thumbnailUrl ? (
            /* No video uploaded — show thumbnail with overlay message */
            <div className="w-full h-full relative">
              <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3">
                  <Play size={24} className="text-white/40 ml-1" fill="currentColor" />
                </div>
                <p className="text-white/60 text-sm">Video coming soon</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <p className="text-sm">No video uploaded yet</p>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-secondary rounded-lg text-xs font-medium capitalize">{project.category}</span>
            {project.year && <span className="px-3 py-1 bg-secondary rounded-lg text-xs font-medium">{project.year}</span>}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{project.title}</h3>
          {project.description && <p className="text-muted-foreground leading-relaxed mb-8">{project.description}</p>}
          <div className="grid sm:grid-cols-3 gap-6">
            {project.client && <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0"><User size={16} className="text-muted-foreground" /></div><div><p className="text-xs text-muted-foreground mb-0.5">Client</p><p className="font-medium text-sm">{project.client}</p></div></div>}
            {project.duration && <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0"><Clock size={16} className="text-muted-foreground" /></div><div><p className="text-xs text-muted-foreground mb-0.5">Duration</p><p className="font-medium text-sm">{project.duration}</p></div></div>}
            {project.role && <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0"><Wrench size={16} className="text-muted-foreground" /></div><div><p className="text-xs text-muted-foreground mb-0.5">Role</p><p className="font-medium text-sm">{project.role}</p></div></div>}
          </div>
          {project.software.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Software Used</p>
              <p className="text-sm text-foreground">{project.software.join(', ')}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
