import { motion } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { useInView } from '../hooks/useAnimations';

export function About() {
  const { portfolioOwner, skills } = usePortfolio();
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="about" className="py-28 px-6 lg:px-8 bg-card" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Text */}
          <div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <span className="text-sm font-medium text-muted-foreground tracking-[0.2em] uppercase mb-4 block">About</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                The Editor Behind<br />
                <span className="text-muted-foreground">the Timeline</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">{portfolioOwner.bio}</p>
              <p className="text-base text-muted-foreground/80 leading-relaxed">
                With over {portfolioOwner.experience} years of experience in post-production, 
                I bring technical precision and creative vision to every project. 
                From fast-paced commercials to deeply personal documentaries, 
                every cut serves the story.
              </p>
            </motion.div>

            {/* Quick facts */}
            <motion.div
              className="mt-8 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-background rounded-2xl p-5 border border-border">
                <p className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{portfolioOwner.experience}+</p>
                <p className="text-xs text-muted-foreground mt-1">Years Experience</p>
              </div>
              <div className="bg-background rounded-2xl p-5 border border-border">
                <p className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>100%</p>
                <p className="text-xs text-muted-foreground mt-1">Client Satisfaction</p>
              </div>
            </motion.div>
          </div>

          {/* Right — Skills */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-semibold text-sm text-muted-foreground tracking-wide uppercase mb-6">Software & Skills</h3>
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
