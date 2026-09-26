import { motion } from 'framer-motion';

const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Subtle Gold Gradient */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-primary/4 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-primary/3 rounded-full blur-[150px]" />
      
      {/* Floating Golden Dust */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/25"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
            scale: Math.random() * 2 + 0.5
          }}
          animate={{
            y: [0, -20 - Math.random() * 40, 0],
            x: [0, 10 - Math.random() * 20, 0],
            opacity: [Math.random() * 0.3 + 0.1, Math.random() * 0.5 + 0.3, Math.random() * 0.3 + 0.1]
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 3
          }}
        />
      ))}
      
      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
        }}
      />
    </div>
  );
};

export default BackgroundEffects;