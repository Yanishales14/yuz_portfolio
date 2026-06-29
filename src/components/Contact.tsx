import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useInView } from '../hooks/useAnimations';

export function Contact() {
  const { portfolioOwner } = usePortfolio();
  const { ref, isInView } = useInView(0.1);

  return (
    <>
      <section id="contact" className="py-24 px-6 lg:px-8" ref={ref}>
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <span className="text-sm font-medium text-muted-foreground tracking-[0.2em] uppercase mb-4 block">Get in Touch</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Let's Create Something<br /><span className="text-muted-foreground">Unforgettable</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12">
              Have a project in mind? Let's bring your vision to life.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }}>
            <a href="#contact-form" className="group inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background rounded-2xl font-medium text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl">
              Start a Project
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {portfolioOwner.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">{portfolioOwner.title}</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {portfolioOwner.name}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
