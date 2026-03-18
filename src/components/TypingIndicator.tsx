import React from 'react';
import { motion } from 'motion/react';

export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg">
      <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mr-2">Resonating</span>
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gradient-to-t from-purple-400 to-blue-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            animate={{
              y: [0, -6, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};
