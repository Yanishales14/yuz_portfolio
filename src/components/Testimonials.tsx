import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useInView } from '../hooks/useAnimations';

export function Testimonials() {
  const { testimonials } = usePortfolio();
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="testimonials" className="py-24 px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <span className="text-sm font-medium text-muted-foreground tracking-[0.2em] uppercase mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>What Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Trusted by world-class brands and creative teams.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div key={testimonial.id} className="relative bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-foreground/5 transition-all duration-300" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}>
              <Quote size={32} className="text-muted-foreground/10 mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                {testimonial.avatar && <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />}
                <div>
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-16 flex flex-wrap items-center justify-center gap-8" initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.3 } : {}} transition={{ duration: 1, delay: 0.8 }}>
          {['Nike', 'Netflix', 'Apple', 'Universal', 'NatGeo'].map((brand) => (
            <span key={brand} className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{brand}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
