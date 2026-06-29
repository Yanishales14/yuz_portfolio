import { motion } from 'framer-motion';
import { useCounter } from '../hooks/useAnimations';
import { usePortfolio } from '../hooks/usePortfolio';

export function Stats() {
  const { projects, portfolioOwner } = usePortfolio();

  // Dynamic stats calculated from projects
  const projectCount = projects.length;
  const categories = new Set(projects.map(p => p.category)).size;
  const experience = portfolioOwner.experience;

  const statItems = [
    { label: 'Projects', value: projectCount, suffix: '' },
    { label: 'Categories', value: categories, suffix: '' },
    { label: 'Years Experience', value: experience, suffix: '+' },
  ];

  if (projects.length === 0) return null;

  return (
    <section className="py-20 px-6 lg:px-8 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {statItems.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index }: { stat: { label: string; value: number; suffix: string }; index: number }) {
  const { count, ref } = useCounter(stat.value, 2000);

  return (
    <motion.div ref={ref} className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }}>
      <p className="text-3xl md:text-4xl font-bold mb-1 tabular-nums" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {count}{stat.suffix}
      </p>
      <p className="text-sm text-muted-foreground">{stat.label}</p>
    </motion.div>
  );
}
