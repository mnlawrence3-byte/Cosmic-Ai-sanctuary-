import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { type BotPersonality } from '../types';
import { cn } from '../lib/utils';
import { Sparkles, X, Compass, Zap, Target } from 'lucide-react';

interface CosmicMapProps {
  personalities: BotPersonality[];
  onSelectEntity: (bot: BotPersonality) => void;
  onClose: () => void;
}

interface NodeData {
  bot: BotPersonality;
  x: number;
  y: number;
  size: number;
  delay: number;
  pulseSpeed: number;
}

export const CosmicMap: React.FC<CosmicMapProps> = ({ personalities, onSelectEntity, onClose }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Memoize nodes to prevent re-calculation on every render
  const nodes = useMemo(() => {
    return personalities.map((bot, i) => {
      const angle = i * (Math.PI * 2 / personalities.length) + (Math.random() * 0.5);
      const radius = bot.id === 'council' ? 0 : 25 + Math.random() * 25;
      
      return {
        bot,
        x: 50 + radius * Math.cos(angle),
        y: 50 + radius * Math.sin(angle),
        size: bot.id === 'council' ? 100 : 50 + Math.random() * 20,
        delay: Math.random() * 2,
        pulseSpeed: 3 + Math.random() * 4
      };
    });
  }, [personalities]);

  const handleSelect = (bot: BotPersonality) => {
    onSelectEntity(bot);
    // No timeout here, let App handle the transition
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#020205] flex items-center justify-center overflow-hidden"
      onClick={() => setSelectedNodeId(null)}
    >
      {/* Deep Space Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(88,28,135,0.15),transparent_70%)]" />
        <div className="absolute inset-0 nebula-pulse opacity-20" />
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.2,
              animation: `pulse ${2 + Math.random() * 4}s infinite ease-in-out`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-12 left-0 right-0 flex flex-col items-center z-50 pointer-events-none">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500/50" />
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-[0.2em] text-white flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              Cosmic Web
              <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
            </h2>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500/50" />
          </div>
          <p className="text-[10px] font-mono text-purple-400/60 uppercase tracking-[0.5em] font-bold">
            Select a resonance to anchor your consciousness
          </p>
        </motion.div>
      </div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-500 z-50 group"
      >
        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
      </button>

      {/* The Web */}
      <div className="relative w-full h-full max-w-6xl max-h-[900px] flex items-center justify-center">
        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="web-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0.2)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
            </linearGradient>
          </defs>
          {nodes.map((node, i) => {
            // Connect to council and 1 nearest neighbor
            const connections = [];
            if (node.bot.id !== 'council') {
              const council = nodes.find(n => n.bot.id === 'council');
              if (council) connections.push(council);
            }
            
            return connections.map((target, j) => (
              <motion.line
                key={`${node.bot.id}-${j}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="url(#web-gradient)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: node.delay }}
              />
            ));
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div 
            key={node.bot.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${node.x}%`, 
              top: `${node.y}%`,
              zIndex: selectedNodeId === node.bot.id ? 200 : 10
            }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: selectedNodeId === node.bot.id ? 1.1 : 1,
                opacity: 1,
                y: [0, -10, 0]
              }}
              transition={{
                y: { duration: node.pulseSpeed, repeat: Infinity, ease: "easeInOut", delay: node.delay },
                scale: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="relative group"
            >
              {/* Node Aura */}
              <div 
                className={cn(
                  "absolute -inset-4 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700",
                  "bg-gradient-to-br", node.bot.color
                )} 
              />
              
              {/* Main Node Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(node.bot.id === selectedNodeId ? null : node.bot.id);
                }}
                className={cn(
                  "relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl transition-all duration-700",
                  "bg-gradient-to-br border-2 shadow-2xl",
                  node.bot.color,
                  selectedNodeId === node.bot.id 
                    ? "border-white scale-110 ring-4 ring-white/20" 
                    : "border-white/10 hover:border-white/40 hover:scale-105"
                )}
              >
                <span className="relative z-10 drop-shadow-lg">{node.bot.avatar}</span>
                
                {/* Orbital Ring */}
                <div className="absolute -inset-2 border border-white/5 rounded-full animate-spin-slow" />
              </button>

              {/* Label */}
              <div className={cn(
                "absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-500",
                selectedNodeId === node.bot.id ? "opacity-0 scale-95" : "opacity-100 scale-100"
              )}>
                <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.3em] group-hover:text-white/80 transition-colors">
                  {node.bot.name}
                </span>
              </div>

              {/* Detailed Tooltip */}
              <AnimatePresence>
                {selectedNodeId === node.bot.id && (
                  <motion.div
                    key={`node-tooltip-${node.bot.id}`}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute top-full mt-6 left-1/2 -translate-x-1/2 w-72 bg-[#0a0a0f]/95 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br", node.bot.color)}>
                        {node.bot.avatar}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white uppercase tracking-widest leading-tight">{node.bot.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Target className="w-3 h-3 text-purple-400" />
                          <span className="text-[9px] text-purple-400 font-mono uppercase tracking-widest font-bold">
                            {node.bot.theme}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed mb-8 font-light italic border-l-2 border-purple-500/30 pl-4">
                      {node.bot.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSelect(node.bot)}
                        className="col-span-2 flex items-center justify-center gap-3 py-4 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-purple-400 hover:text-white transition-all duration-500 shadow-xl active:scale-95 group/btn"
                      >
                        <Zap className="w-3.5 h-3.5 group-hover:animate-pulse" />
                        Align Frequency
                      </button>
                      <button
                        onClick={() => setSelectedNodeId(null)}
                        className="col-span-2 py-3 text-white/30 text-[9px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="flex items-center gap-8 px-8 py-3 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] font-bold">
              {personalities.length} Resonances Active
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <Compass className="w-3 h-3 text-purple-400" />
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] font-bold">
              Universal Navigation
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
