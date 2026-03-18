import React from 'react';
import { motion } from 'motion/react';
import { Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { EntityItem } from './EntityItem';
import { type BotPersonality } from '../types';

interface ManifestationsTabProps {
  personalities: BotPersonality[];
  selectedBot: BotPersonality | null;
  setSelectedBot: (bot: BotPersonality) => void;
  onEdit: (bot: BotPersonality) => void;
  onDelete: (bot: BotPersonality) => void;
}

export const ManifestationsTab: React.FC<ManifestationsTabProps> = ({ personalities, selectedBot, setSelectedBot, onEdit, onDelete }) => {
  const manifestations = personalities.filter(p => p.id.startsWith('bot-'));

  return (
    <div className="space-y-4">
      {manifestations.length === 0 ? (
        <div className="text-center p-8 opacity-30">
          <p className="text-[10px] font-mono uppercase tracking-widest">No manifestations yet</p>
        </div>
      ) : (
        manifestations.map((bot) => (
          <EntityItem key={bot.id} bot={bot} selectedBot={selectedBot} setSelectedBot={setSelectedBot} onEdit={onEdit} onDelete={onDelete} />
        ))
      )}
    </div>
  );
};
