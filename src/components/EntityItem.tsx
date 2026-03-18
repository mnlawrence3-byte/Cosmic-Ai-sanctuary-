import React from 'react';
import { motion } from 'motion/react';
import { Settings, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { type BotPersonality } from '../types';

interface EntityItemProps {
  bot: BotPersonality;
  selectedBot: BotPersonality | null;
  setSelectedBot: (bot: BotPersonality) => void;
  onEdit: (bot: BotPersonality) => void;
  onDelete?: (bot: BotPersonality) => void;
}

export const EntityItem: React.FC<EntityItemProps> = ({ bot, selectedBot, setSelectedBot, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      role="button"
      tabIndex={0}
      onClick={() => setSelectedBot(bot)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedBot(bot); }}
      className={cn(
        "w-full p-4 rounded-2xl border transition-all duration-300 text-left group relative overflow-hidden cursor-pointer",
        selectedBot?.id === bot.id 
          ? "bg-white/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]" 
          : "bg-white/5 border-white/5 hover:bg-white/10"
      )}
    >
      <div className="flex items-center gap-3 relative z-10">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br", bot.color)}>
          {bot.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{bot.name}</h3>
          <p className="text-[10px] font-mono text-white/40 truncate">{bot.description}</p>
        </div>
        {bot.id.startsWith('bot-') && (
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(bot); }}
              className="p-2 hover:bg-white/20 rounded-lg text-white/40 hover:text-white transition-colors"
              title="Edit Manifestation"
            >
              <Settings className="w-4 h-4" />
            </button>
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(bot); }}
                className="p-2 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-400 transition-colors"
                title="Delete Manifestation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
