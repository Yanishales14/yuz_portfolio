import { motion } from 'framer-motion';
import { Search, Layers, Scissors, Palette, Send } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useInView } from '../hooks/useAnimations';

const iconMap: Record<string, React.ReactNode> = {
  search: <Search size={22} />,
  layers: <Layers size={22} />,
  scissors: <Scissors size={22} />,
  palette: <Palette size={22} />,
  send: <Send size={22} />,
};

export function EditingProcess() {
  const { processSteps } = usePortfolio();
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="process" className="py-28 px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <span className="text-sm font-medium text-muted-foreground tracking-[0.2em] uppercase mb-4 block">Workflow</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>My Editing Process</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">From initial concept to final delivery, every step is crafted with precision.</p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
          {processSteps.map((step, i) => (
            <motion.div key={step.number} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}>
              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-foreground/10 transition-all duration-300 group h-full">
                <div className="text-xs font-mono text-muted-foreground/40 mb-4">{step.number}</div>
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                  {iconMap[step.icon] || <Layers size={22} />}
                </div>
                <h3 className="font-bold mb-2 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline visualization */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.8 }}>
          <h3 className="text-center text-sm font-medium text-muted-foreground tracking-wide uppercase mb-8">Timeline View</h3>
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 overflow-hidden">
            <div className="flex items-center gap-4 mb-6 text-[10px] font-mono text-muted-foreground/60">
              <span className="w-16">00:00</span>
              <div className="flex-1 flex justify-between border-b border-border pb-2">
                {['0:30', '1:00', '1:30', '2:00', '2:30', '3:00'].map(t => <span key={t}>{t}</span>)}
              </div>
            </div>
            <div className="mb-3">
              <span className="text-[10px] text-muted-foreground/50 mb-1.5 block font-mono">V1 — Video</span>
              <div className="flex gap-1 h-9">
                {[{ color: '#3b82f6', flex: 3 }, { color: '#6366f1', flex: 2 }, { color: '#8b5cf6', flex: 4 }, { color: '#a855f7', flex: 1 }, { color: '#3b82f6', flex: 3 }].map((clip, i) => (
                  <motion.div key={i} className="rounded-md relative overflow-hidden shadow-sm" style={{ backgroundColor: clip.color, flex: clip.flex }} initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 0.5, delay: 1 + i * 0.12 }}>
                    <div className="absolute inset-0 flex items-center px-2"><span className="text-[8px] text-white/70 font-mono truncate">{['Intro', 'B-Roll', 'Interview', 'Cut', 'Outro'][i]}</span></div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <span className="text-[10px] text-muted-foreground/50 mb-1.5 block font-mono">A1 — Audio</span>
              <div className="h-7 bg-green-500/15 rounded-md relative overflow-hidden border border-green-500/10">
                <motion.div className="absolute inset-y-0 left-0 bg-green-500/25 rounded-md" initial={{ width: 0 }} animate={isInView ? { width: '100%' } : {}} transition={{ duration: 1.2, delay: 1.2 }} />
                <div className="absolute inset-0 flex items-center justify-around px-2 overflow-hidden">
                  {Array.from({ length: 50 }).map((_, i) => <div key={i} className="w-[2px] bg-green-400/50 rounded-full flex-shrink-0" style={{ height: `${20 + Math.random() * 70}%` }} />)}
                </div>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground/50 mb-1.5 block font-mono">A2 — Music</span>
              <div className="h-7 bg-amber-500/10 rounded-md relative overflow-hidden border border-amber-500/10">
                <motion.div className="absolute inset-y-0 left-0 bg-amber-500/20 rounded-md" initial={{ width: 0 }} animate={isInView ? { width: '100%' } : {}} transition={{ duration: 1.2, delay: 1.4 }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
