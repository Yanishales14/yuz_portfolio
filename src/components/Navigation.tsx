import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Work', section: 'work' },
  { label: 'About', section: 'about' },
  { label: 'Process', section: 'process' },
  { label: 'Contact', section: 'contact' },
];

interface NavigationProps {
  show?: boolean;
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Navigation({ show = true }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'py-3 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
          : 'py-5 bg-transparent'
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={show ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="relative group flex items-baseline">
            <span
              className="text-xl font-bold tracking-[-0.03em]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              YUZ
            </span>
            <span className="text-xl font-light text-muted-foreground ml-1">Studio</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.section}
                onClick={() => scrollToSection(link.section)}
                className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="ml-3 px-5 py-2 bg-foreground text-background text-[13px] font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Hire Me
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.section}
                  onClick={() => scrollToSection(link.section)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.label}
                </motion.button>
              ))}
              <button
                onClick={() => scrollToSection('contact')}
                className="mt-2 px-5 py-3 bg-foreground text-background text-sm font-medium rounded-xl text-center hover:opacity-90 transition-opacity"
              >
                Hire Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
