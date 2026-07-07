import { motion } from 'framer-motion';
import { useScrollProgress } from '../hooks/useAnimations';

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-foreground/60 z-[60] origin-left"
      style={{ scaleX: progress }}
    />
  );
}
