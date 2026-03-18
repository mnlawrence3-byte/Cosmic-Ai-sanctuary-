import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';
import { type JournalEntry } from '../types';

interface TimelineViewProps {
  entries: JournalEntry[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ entries }) => {
  const data = entries.map(entry => ({
    x: entry.timestamp,
    y: 1, // All on one line
    z: 50,
    name: entry.botName,
    avatar: entry.botAvatar,
    summary: entry.summary,
    type: entry.type
  }));

  return (
    <div className="h-48 md:h-64 w-full glass-panel rounded-3xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Time" 
            domain={['auto', 'auto']} 
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
            stroke="rgba(255,255,255,0.2)"
            fontSize={10}
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
          />
          <YAxis type="number" dataKey="y" hide />
          <ZAxis type="number" dataKey="z" range={[100, 400]} />
          <Tooltip 
            cursor={{ stroke: 'rgba(168, 85, 247, 0.3)', strokeWidth: 1 }} 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="glass-panel border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{data.avatar}</span>
                      <p className="text-xs font-display font-bold text-white uppercase tracking-widest">{data.name}</p>
                    </div>
                    <p className="text-[10px] text-white/40 italic line-clamp-2 max-w-[200px] leading-relaxed">{data.summary}</p>
                    <p className="text-[8px] text-purple-400 font-mono mt-2 uppercase tracking-widest">{new Date(data.x).toLocaleString()}</p>
                  </div>
                );
              }
              return null;
            }} 
          />
          <Scatter data={data} fill="#8b5cf6">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.type === 'chat' ? '#8b5cf6' : '#ec4899'} 
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
                className="hover:filter hover:brightness-125 transition-all cursor-pointer"
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
