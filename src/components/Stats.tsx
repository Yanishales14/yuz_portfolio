import { motion } from 'framer-motion';
import { useCounter, useInView } from '../hooks/useAnimations';
import { usePortfolio } from '../hooks/usePortfolio';

export function Stats() {
  const { projects, portfolioOwner } = usePortfolio();
  const { ref, isInView } = useInView(0.1);

  const projectCount = projects.length;
  const categories = new Set(projects.map(p => p.category)).size;
  const experience = portfolioOwner.experience;
  const clients = new Set(projects.map(p => p.client).filter(Boolean)).size;

  const statItems = [
    { label: 'Projects Delivered', value: projectCount, suffix: '+' },
    { label: 'Categories', value: categories, suffix: '' },
    { label: 'Years Experience', value: experience, suffix: '+' },
    { label: 'Happy Clients', value: clients, suffix: '+' },
  ];

  if (projects.length === 0) return null;

  return (
    <section className="py-20 px-6 lg:px-8 bg-card border-y border-border" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index, isInView }: { stat: { label: string; value: number; suffix: string }; index: number; isInView: boolean }) {
  const { count, ref } = useCounter(stat.value, 2000);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <p className="text-3xl md:text-5xl font-bold mb-2 tabular-nums tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {count}{stat.suffix}
      </p>
      <p className="text-sm text-muted-foreground">{stat.label}</p>
    </motion.div>
  );
}
