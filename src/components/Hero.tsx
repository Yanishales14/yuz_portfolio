import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

interface HeroProps {
  ready?: boolean;
}

export function Hero({ ready = true }: HeroProps) {
  const [animate, setAnimate] = useState(false);
  const { portfolioOwner } = usePortfolio();

  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&h=1080&fit=crop)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(250,250,249,0.3) 100%)' }} />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-[20%] left-[8%] w-32 h-32 rounded-3xl bg-white/[0.02] border border-white/[0.04]" animate={{ y: [-15, 15, -15], rotate: [0, 3, -3, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute top-[30%] right-[10%] w-20 h-20 rounded-full bg-white/[0.02] border border-white/[0.04]" animate={{ y: [15, -15, 15], x: [0, -5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
        <motion.div className="absolute bottom-[25%] left-[15%] w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04]" animate={{ y: [10, -10, 10], rotate: [45, 55, 45] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />
        <motion.div className="absolute top-[15%] right-[30%] w-2 h-2 rounded-full bg-foreground/10" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
        <motion.div className="absolute bottom-[35%] right-[20%] w-1.5 h-1.5 rounded-full bg-foreground/10" animate={{ scale: [1, 2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 1.5 }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center pt-32 pb-32">
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={animate ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-sm font-medium text-foreground shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            Available for projects
          </span>
        </motion.div>

        <motion.h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold tracking-[-0.03em] leading-[1.05] mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }} initial={{ opacity: 0, y: 50 }} animate={animate ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          Crafting Visual<br />
          <span className="text-muted-foreground/40">Stories That</span><br />
          <span className="relative inline-block">
            Captivate
            <motion.span className="absolute -bottom-2 left-0 right-0 h-[3px] bg-foreground/20 rounded-full" initial={{ scaleX: 0 }} animate={animate ? { scaleX: 1 } : {}} transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }} style={{ transformOrigin: 'left' }} />
          </span>
        </motion.h1>

        <motion.p className="max-w-lg mx-auto text-base md:text-lg text-muted-foreground leading-relaxed mb-12" initial={{ opacity: 0, y: 20 }} animate={animate ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          {portfolioOwner.bio}
        </motion.p>

        <motion.div className="flex flex-wrap items-center justify-center gap-4" initial={{ opacity: 0, y: 20 }} animate={animate ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <motion.a href="#work" className="group flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-2xl font-medium shadow-lg hover:shadow-xl transition-shadow" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            View My Work
          </motion.a>
          <motion.a href="#contact" className="px-8 py-4 bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl font-medium hover:bg-white/80 transition-colors shadow-sm" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            Get in Touch
          </motion.a>
        </motion.div>

        <motion.div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={animate ? { opacity: 1 } : {}} transition={{ delay: 1.2, duration: 1 }}>
          <span className="text-[10px] text-muted-foreground/60 tracking-[0.3em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}><ArrowDown size={16} className="text-muted-foreground/40" /></motion.div>
        </motion.div>
      </div>
    </section>
  );
}
