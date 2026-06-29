import { motion } from 'framer-motion';
import { Camera, Clapperboard, Film, Music, Play } from 'lucide-react';

const elements = [
  { icon: <Camera size={16} />, x: '8%', y: '20%', delay: 0 },
  { icon: <Clapperboard size={14} />, x: '85%', y: '15%', delay: 1 },
  { icon: <Film size={18} />, x: '92%', y: '60%', delay: 2 },
  { icon: <Music size={14} />, x: '5%', y: '70%', delay: 3 },
  { icon: <Play size={12} />, x: '75%', y: '80%', delay: 4 },
];

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute text-muted-foreground/10"
          style={{ left: el.x, top: el.y }}
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: el.delay,
          }}
        >
          {el.icon}
        </motion.div>
      ))}
    </div>
  );
}
