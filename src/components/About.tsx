import { motion } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { useInView } from '../hooks/useAnimations';

export function About() {
  const { portfolioOwner, skills } = usePortfolio();
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="about" className="py-24 px-6 lg:px-8 bg-card" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <span className="text-sm font-medium text-muted-foreground tracking-[0.2em] uppercase mb-4 block">About</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              The Editor Behind<br /><span className="text-muted-foreground">the Timeline</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{portfolioOwner.bio}</p>
          </motion.div>

          <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }}>
            <h3 className="font-semibold text-sm text-muted-foreground tracking-wide uppercase mb-4">Software & Skills</h3>
            {skills.map((skill, i) => (
              <motion.div key={skill.name} initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div className="h-full bg-foreground rounded-full" initial={{ width: 0 }} animate={isInView ? { width: `${skill.level}%` } : { width: 0 }} transition={{ duration: 1, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
