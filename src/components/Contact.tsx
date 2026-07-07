import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useInView } from '../hooks/useAnimations';

export function Contact() {
  const { portfolioOwner } = usePortfolio();
  const { ref, isInView } = useInView(0.1);

  return (
    <>
      <section id="contact" className="py-28 px-6 lg:px-8" ref={ref}>
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <span className="text-sm font-medium text-muted-foreground tracking-[0.2em] uppercase mb-4 block">Get in Touch</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Let's Create Something<br />
              <span className="text-muted-foreground">Unforgettable</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12">
              Have a project in mind? Let's bring your vision to life with precision editing and cinematic storytelling.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.a
              href="mailto:hello@yuzstudio.com"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background rounded-2xl font-medium text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail size={20} />
              Start a Project
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-20"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.2 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Blender', 'Photoshop'].map((tool) => (
              <span key={tool} className="text-sm font-medium tracking-wide uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {tool}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="py-16 px-6 lg:px-8 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold tracking-tight mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                YUZ<span className="font-light text-muted-foreground">Studio</span>
              </h3>
              <p className="text-sm text-muted-foreground">{portfolioOwner.title}</p>
            </div>
            <div className="flex items-center gap-6">
              <a href="#work" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Work</a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#process" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Process</a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {portfolioOwner.name} Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
