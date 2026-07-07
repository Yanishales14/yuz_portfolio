import { motion } from 'framer-motion';
import { useMousePosition } from '../hooks/useAnimations';

export function CursorGlow() {
  const { x, y } = useMousePosition();

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] w-[400px] h-[400px] rounded-full opacity-[0.05] hidden md:block"
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.12) 0%, transparent 70%)',
        left: x - 200,
        top: y - 200,
      }}
      animate={{
        left: x - 200,
        top: y - 200,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.5,
      }}
    />
  );
}
