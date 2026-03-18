import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const Background = () => {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#020205]" />
      
      {/* Nebula Blobs */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`nebula-${i}`}
          className="absolute rounded-full bg-purple-500/10 blur-[100px]"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            scale: Math.random() * 0.5 + 0.5,
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            width: Math.random() * 400 + 200,
            height: Math.random() * 400 + 200,
          }}
        />
      ))}

      {/* Cosmic Dust / Stars */}
      {[...Array(100)].map((_, i) => {
        const size = Math.random() * 2 + 1;
        return (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              opacity: [Math.random() * 0.5 + 0.1, Math.random() * 0.8 + 0.4, Math.random() * 0.5 + 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
            style={{
              width: size,
              height: size,
              boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.8)`
            }}
          />
        );
      })}
    </div>
  );
};
