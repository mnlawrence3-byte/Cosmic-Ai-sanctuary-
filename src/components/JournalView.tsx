import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Share2, Trash2, ChevronRight, Moon, History, Sparkles, MessageSquare, Zap, Search, Download, RefreshCw, X, Plus, Check } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '../lib/utils';
import { type JournalEntry, type UserProfile, type Manifestation } from '../types';

interface JournalViewProps {
  journalEntries: JournalEntry[];
  selectedJournalEntry: JournalEntry | null;
  setSelectedJournalEntry: (entry: JournalEntry | null) => void;
  deleteJournalEntry: (id: string) => void;
  updateJournalEntry: (entry: JournalEntry) => void;
  createJournalNote: () => void;
  createManifestation: () => void;
  createMagicWorkshop: () => void;
  generateCosmicComments: (entry: JournalEntry) => void;
  isGeneratingComments: boolean;
  handleSetView: (view: 'landing' | 'chat' | 'journal') => void;
  setView: (view: 'landing' | 'chat' | 'journal') => void;
  userProfile: UserProfile;
  copyToClipboard: (text: string, id: string) => void;
  triggerNotification: (notif: { title: string; message: string; type: 'success' | 'error' | 'info'; icon?: string }) => void;
  currentTheme: string;
}

const MagicWorkshopEditor = ({ entry, onUpdate }: { entry: JournalEntry; onUpdate: (entry: JournalEntry) => void }) => {
  return (
    <div className="p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem] glass-panel border border-white/10 relative overflow-hidden group shadow-2xl">
      <textarea
        value={entry.content || ''}
        onChange={(e) => onUpdate({ ...entry, content: e.target.value })}
        placeholder="Weave your magic expression..."
        className="w-full min-h-[300px] md:min-h-[500px] bg-transparent text-white/90 font-serif italic text-xl md:text-2xl leading-relaxed outline-none resize-none placeholder:text-white/5 custom-scrollbar"
      />
    </div>
  );
};

const ManifestationEditor = ({ entry, onUpdate }: { entry: JournalEntry; onUpdate: (entry: JournalEntry) => void }) => {
  const manifestation = entry.manifestation!;
  
  const updateManifestation = (updates: Partial<Manifestation>) => {
    onUpdate({
      ...entry,
      manifestation: { ...manifestation, ...updates }
    });
  };

  const addAction = () => {
    const newAction = { id: 'action-' + Date.now(), text: '', completed: false };
    updateManifestation({ actions: [...manifestation.actions, newAction] });
  };

  const toggleAction = (id: string) => {
    updateManifestation({
      actions: manifestation.actions.map(a => a.id === id ? { ...a, completed: !a.completed } : a)
    });
  };

  const updateActionText = (id: string, text: string) => {
    updateManifestation({
      actions: manifestation.actions.map(a => a.id === id ? { ...a, text } : a)
    });
  };

  const removeAction = (id: string) => {
    updateManifestation({
      actions: manifestation.actions.filter(a => a.id !== id)
    });
  };

  const completedCount = manifestation.actions.filter(a => a.completed).length;
  const alignment = manifestation.actions.length > 0 ? Math.round((completedCount / manifestation.actions.length) * 100) : 0;

  return (
    <div className="space-y-12">
      <div className="p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] glass-panel border border-white/10 relative overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 nebula-pulse opacity-[0.03] pointer-events-none" />
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4">
            <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
            <h4 className="text-[11px] font-mono uppercase tracking-[0.4em] text-white/30 font-bold">Etheric Intention</h4>
          </div>
          <textarea
            value={manifestation.intention}
            onChange={(e) => updateManifestation({ intention: e.target.value })}
            placeholder="What reality are you consciously imagining?"
            className="w-full bg-transparent text-2xl md:text-4xl font-serif italic text-white/90 leading-tight outline-none resize-none placeholder:text-white/5"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-teal-400" />
              <h4 className="text-[11px] font-mono uppercase tracking-[0.4em] text-white/30 font-bold">Conscious Actions</h4>
            </div>
            <button 
              onClick={addAction}
              className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {manifestation.actions.map((action) => (
              <div key={action.id} className="flex items-center gap-4 group/action">
                <button 
                  onClick={() => toggleAction(action.id)}
                  className={cn(
                    "w-6 h-6 rounded-lg border transition-all flex items-center justify-center",
                    action.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/10 hover:border-white/30"
                  )}
                >
                  {action.completed && <Check className="w-4 h-4" />}
                </button>
                <input 
                  value={action.text}
                  onChange={(e) => updateActionText(action.id, e.target.value)}
                  placeholder="Action to take..."
                  className={cn(
                    "flex-1 bg-transparent border-none outline-none text-lg transition-all",
                    action.completed ? "text-white/20 line-through" : "text-white/80"
                  )}
                />
                <button 
                  onClick={() => removeAction(action.id)}
                  className="p-2 rounded-lg text-white/0 group-hover/action:text-white/20 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {manifestation.actions.length === 0 && (
              <p className="text-center py-12 text-white/10 font-mono text-[10px] uppercase tracking-widest border border-dashed border-white/5 rounded-3xl">
                No actions anchored yet
              </p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[2rem] glass-panel border border-white/10 text-center space-y-6">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 font-bold">Alignment</h4>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/5"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * alignment) / 100}
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-display font-bold text-white">{alignment}%</span>
              </div>
            </div>
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest leading-relaxed">
              {alignment === 100 ? "Fully Manifested" : alignment > 0 ? "Anchoring in progress" : "Etheric Potential"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarkdownCode = React.memo(({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      style={vscDarkPlus as any}
      language={match[1]}
      PreTag="div"
      className="rounded-xl !bg-black/40 !border !border-white/10 my-4"
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={cn("bg-white/10 px-1.5 py-0.5 rounded text-purple-300 font-mono text-[0.9em]", className)} {...props}>
      {children}
    </code>
  );
});

export const JournalView: React.FC<JournalViewProps> = React.memo(({
  journalEntries,
  selectedJournalEntry,
  setSelectedJournalEntry,
  deleteJournalEntry,
  updateJournalEntry,
  createJournalNote,
  createManifestation,
  createMagicWorkshop,
  generateCosmicComments,
  isGeneratingComments,
  handleSetView,
  setView,
  userProfile,
  copyToClipboard,
  triggerNotification,
  currentTheme
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [filterType, setFilterType] = React.useState<'all' | 'chat' | 'note' | 'manifestation'>('all');
  const [saveStatus, setSaveStatus] = React.useState<'saved' | 'saving' | null>(null);

  const filteredEntries = React.useMemo(() => {
    console.log('Journal Entries:', journalEntries);
    return journalEntries.filter(entry => {
      const matchesSearch = entry.botName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.messages?.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        entry.manifestation?.intention.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || (entry.type === filterType) || (filterType === 'chat' && !entry.type);
      
      return matchesSearch && matchesType;
    });
  }, [journalEntries, searchQuery, filterType]);

  const handleUpdateNote = (entry: JournalEntry) => {
    setSaveStatus('saving');
    updateJournalEntry(entry);
    setTimeout(() => setSaveStatus('saved'), 500);
    setTimeout(() => setSaveStatus(null), 2000);
  };

  return (
    <div className={cn("flex h-[100dvh] w-full relative overflow-hidden font-sans", currentTheme === 'cosmic' ? 'cosmic-bg' : currentTheme === 'ocean' ? 'ocean-bg' : currentTheme === 'forest' ? 'forest-bg' : 'sunset-bg')}>
      <div className="absolute inset-0 pointer-events-none star-field" />
      <div className="absolute inset-0 pointer-events-none constellation-field" />
      
      <aside className={cn(
        "w-full lg:w-80 h-full glass-panel flex-col transition-all duration-500 relative z-10",
        selectedJournalEntry ? "hidden lg:flex" : "flex"
      )}>
        <div className="p-6 md:p-8 border-b border-white/10 flex items-center gap-4 glass-panel relative overflow-hidden">
          <div className="absolute inset-0 nebula-pulse opacity-10 pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] relative z-10">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tighter text-white uppercase cosmic-gradient-text relative z-10">Cosmic AI</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <button 
            onClick={() => handleSetView('chat')}
            className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] text-white/50 hover:text-white hover:bg-white/5 transition-all duration-500 group border border-transparent hover:border-white/10"
          >
            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
            <span className="text-sm font-bold tracking-wide uppercase">Return to Sanctuary</span>
          </button>

          <button 
            onClick={createJournalNote}
            className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-200 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 transition-all duration-500 group shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
            <span className="text-sm font-bold tracking-wide">New Reflection</span>
          </button>

          <button 
            onClick={() => {
              createManifestation();
              setFilterType('all');
            }}
            className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-200 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/30 transition-all duration-500 group shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          >
            <Zap className="w-5 h-5 group-hover:scale-125 transition-transform duration-500" />
            <span className="text-sm font-bold tracking-wide">Anchor Manifestation</span>
          </button>

          <button 
            onClick={() => {
              createMagicWorkshop();
              setFilterType('all');
            }}
            className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-200 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/30 transition-all duration-500 group shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
            <span className="text-sm font-bold tracking-wide">Magic Workshop</span>
          </button>
          
          <div className="px-2 py-4 flex gap-2 overflow-x-auto no-scrollbar">
            {(['all', 'chat', 'note', 'manifestation'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold transition-all duration-500 shrink-0",
                  filterType === type 
                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
                )}
              >
                {type}
              </button>
            ))}
          </div>
          
          <div className="px-2 py-2">
            <div className="relative group/search">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within/search:opacity-100 transition duration-500" />
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />
          <h3 className="px-4 text-[10px] text-white/20 uppercase tracking-[0.3em] font-mono font-bold mb-4">Saved Echoes</h3>
          <div className="space-y-2">
            {filteredEntries.length === 0 ? (
              <div className="px-4 py-12 text-center space-y-4 opacity-20">
                <Moon className="w-10 h-10 mx-auto text-white" />
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">No echoes in the ether</p>
              </div>
            ) : (
              filteredEntries.map(entry => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedJournalEntry(entry)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedJournalEntry(entry);
                    }
                  }}
                  className={cn(
                    "w-full p-5 rounded-[1.5rem] text-left transition-all duration-500 border group relative overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-purple-500/5",
                    selectedJournalEntry?.id === entry.id 
                      ? "bg-white/10 border-white/20 shadow-xl scale-[1.02]" 
                      : "hover:bg-white/[0.03] border-transparent hover:border-white/5"
                  )}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 border border-white/5">
                      {entry.botAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-white/80 truncate group-hover:text-white transition-colors duration-500 uppercase tracking-tight">
                          {entry.type === 'note' ? 'Reflection' : entry.type === 'manifestation' ? 'Manifestation' : entry.botName}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[9px] text-white/20 font-mono font-bold">{new Date(entry.timestamp).toLocaleDateString()}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJournalEntry(entry);
                              setIsDeleting(true);
                            }}
                            className="p-1.5 rounded-lg text-white/0 group-hover:text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Dissolve Echo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {entry.summary && (
                        <p className="text-[10px] text-white/30 truncate italic mt-1 group-hover:text-white/50 transition-colors duration-500 leading-relaxed">
                          {entry.summary}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => handleSetView('landing')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <Moon className="w-4 h-4" />
            Sanctuary
          </button>
        </div>
      </aside>

      <main className={cn(
        "flex-1 flex flex-col relative h-full transition-all duration-500 overflow-x-hidden",
        !selectedJournalEntry ? "hidden lg:flex" : "flex"
      )}>
        {/* Background Nebula Orbs */}
        <div className="absolute top-[10%] right-[10%] w-96 h-96 nebula-pulse bg-purple-600/10 rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] left-[10%] w-96 h-96 nebula-pulse bg-blue-600/10 rounded-full pointer-events-none" style={{ animationDelay: '-4s' }} />

        {/* Silver Bloom Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none z-0 overflow-hidden">
          <h1 className="text-[15vw] font-display font-bold uppercase tracking-tighter silver-bloom-glow">Silver Bloom</h1>
        </div>

        <header className="h-20 md:h-24 flex items-center justify-between px-4 md:px-12 border-b border-white/10 glass-panel shrink-0 relative z-20 gap-4">
          <div className="flex items-center gap-3 md:gap-6 min-w-0">
              <button onClick={() => setSelectedJournalEntry(null)} className="lg:hidden p-2.5 text-white/40 hover:text-white bg-white/5 rounded-xl transition-all shrink-0">
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
            <div className="flex items-center gap-4 md:gap-6 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner shrink-0">
                <Book className="w-6 h-6 text-purple-400 glow-text" />
              </div>
              <h2 className="text-xl md:text-3xl font-display font-bold text-white uppercase tracking-tighter truncate cosmic-gradient-text">Cosmic Journal</h2>
            </div>
          </div>
          {selectedJournalEntry && (
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              <button 
                onClick={() => {
                  const entryContent = selectedJournalEntry.summary || selectedJournalEntry.messages.map(m => m.content).join('\n');
                  const blob = new Blob([entryContent], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `cosmic-echo-${selectedJournalEntry.botName}-${new Date(selectedJournalEntry.timestamp).toLocaleDateString()}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="p-3 md:p-3.5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all duration-300 border border-transparent hover:border-white/10"
                title="Export Journal Entry"
              >
                <Download className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  const entryContent = selectedJournalEntry.summary || selectedJournalEntry.messages.map(m => m.content).join('\n');
                  if (navigator.share) {
                    navigator.share({
                      title: `Cosmic Journal: ${selectedJournalEntry.botName}`,
                      text: entryContent,
                      url: window.location.href
                    }).catch(console.error);
                  } else {
                    copyToClipboard(entryContent, selectedJournalEntry.id);
                    triggerNotification({
                      title: 'Echo Copied',
                      message: 'Journal echo anchored to clipboard.',
                      type: 'success',
                      icon: '📋'
                    });
                  }
                }}
                className="p-3 md:p-3.5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all duration-300 border border-transparent hover:border-white/10"
                title="Share Journal Entry"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsDeleting(true)}
                className="p-3 md:p-3.5 bg-red-500/10 hover:bg-red-500/20 rounded-2xl text-red-500 transition-all duration-300 border border-red-500/20"
                title="Delete Journal Entry"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-12 relative z-10 custom-scrollbar">
          <div className="max-w-5xl lg:max-w-7xl mx-auto w-full">
            {!selectedJournalEntry ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-10 py-20 md:py-32">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[3rem] bg-white/[0.02] flex items-center justify-center border border-white/5 relative group">
                  <div className="absolute inset-0 bg-purple-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <History className="w-12 h-12 md:w-16 md:h-16 text-white/10 group-hover:text-purple-400 transition-all duration-700 group-hover:scale-110" />
                </div>
                <div className="space-y-4 px-6">
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white/60 uppercase tracking-tighter">Select an echo to revisit</h3>
                  <p className="text-sm md:text-base text-white/20 max-w-md mx-auto font-light leading-relaxed">Your past interactions with the celestial family are stored here for reflection and growth.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-12 md:space-y-20 pb-32 w-full">
                <div className="flex flex-col items-center text-center space-y-6 w-full">
                  <div className="w-20 h-20 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.03] flex items-center justify-center text-3xl md:text-6xl border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <span className="relative z-10 group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{selectedJournalEntry.botAvatar}</span>
                  </div>
                  <div className="space-y-3 px-4 md:px-6">
                    <h3 className="text-2xl md:text-6xl font-display font-black text-white uppercase tracking-tighter break-words drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{selectedJournalEntry.botName}</h3>
                    <p className="text-[10px] md:text-xs text-white/30 font-mono uppercase tracking-[0.4em] font-bold">
                      {selectedJournalEntry.type === 'note' ? 'Reflected on' : selectedJournalEntry.type === 'manifestation' ? 'Anchored on' : 'Anchored on'} {new Date(selectedJournalEntry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedJournalEntry.type === 'manifestation' ? (
                  <ManifestationEditor 
                    entry={selectedJournalEntry} 
                    onUpdate={handleUpdateNote} 
                  />
                ) : selectedJournalEntry.type === 'note' ? (
                  <div className="space-y-8">
                    <div className="p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem] glass-panel border border-white/10 relative overflow-hidden group shadow-2xl">
                      <div className="absolute top-6 right-6 text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 font-bold">
                        {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'saved' ? 'Anchored' : ''}
                      </div>
                      <textarea
                        value={selectedJournalEntry.content || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdateNote({
                            ...selectedJournalEntry,
                            content: val,
                            summary: val.slice(0, 100) + (val.length > 100 ? '...' : '')
                          });
                        }}
                        placeholder="Pour your thoughts into the ether..."
                        className="w-full min-h-[300px] md:min-h-[500px] bg-transparent text-white/90 font-serif italic text-xl md:text-2xl leading-relaxed outline-none resize-none placeholder:text-white/5 custom-scrollbar"
                      />
                    </div>
                  </div>
                ) : selectedJournalEntry.type === 'magic-workshop' ? (
                  <MagicWorkshopEditor entry={selectedJournalEntry} onUpdate={handleUpdateNote} />
                ) : (
                  <>
                    {selectedJournalEntry.summary && (
                      <div className="p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem] glass-panel border border-white/10 relative overflow-hidden group shadow-2xl">
                        <div className="absolute inset-0 nebula-pulse opacity-[0.03] pointer-events-none" />
                        <div className="relative z-10 space-y-4 md:space-y-6">
                          <div className="flex items-center gap-3 md:gap-4">
                            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-400 animate-pulse" />
                            <h4 className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.4em] text-white/30 font-bold">Cosmic Insight</h4>
                          </div>
                          <p className="text-lg md:text-3xl font-serif italic text-white/90 leading-relaxed drop-shadow-sm">
                            {selectedJournalEntry.summary}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-8 md:space-y-16">
                      {selectedJournalEntry.messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3 md:gap-6 max-w-4xl mx-auto w-full group/msg",
                            message.role === 'user' ? "flex-row-reverse" : "flex-row"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-[2rem] flex-shrink-0 flex items-center justify-center text-lg md:text-3xl shadow-2xl relative overflow-hidden transition-transform duration-700 group-hover/msg:scale-110",
                            message.role === 'user' ? "bg-white/5 border border-white/10" : "bg-white/5 border border-white/10"
                          )}>
                            <div className="absolute inset-0 nebula-pulse opacity-20" />
                            <span className="relative z-10 drop-shadow-lg">{message.role === 'user' ? userProfile.avatar || '👤' : selectedJournalEntry.botAvatar}</span>
                          </div>
                          <div className={cn(
                            "flex flex-col space-y-2 md:space-y-4 flex-1 min-w-0",
                            message.role === 'user' ? "items-end" : "items-start"
                          )}>
                            <div className={cn(
                              "p-5 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-base md:text-[17px] leading-relaxed shadow-2xl transition-all duration-700 w-full group relative",
                              message.role === 'user' 
                                ? "bg-white/[0.03] text-white/90 rounded-tr-none border border-white/5 hover:bg-white/[0.06] hover:border-white/10" 
                                : "glass-panel text-white/80 rounded-tl-none border-white/10 hover:border-white/20"
                            )}>
                              <button 
                                onClick={() => copyToClipboard(message.content, message.id)}
                                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                                title="Copy Echo"
                              >
                                <Download className="w-4 h-4 rotate-180" />
                              </button>
                              <div className="markdown-body font-light text-left leading-relaxed tracking-wide break-words overflow-hidden">
                                <Markdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    code: MarkdownCode
                                  }}
                                >
                                  {message.content}
                                </Markdown>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest px-4">
                              {message.role === 'user' ? userProfile.name || 'Seeker' : selectedJournalEntry.botName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Cosmic Family Comments */}
                <div className="pt-12 border-t border-white/10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">Cosmic Family Chimes In</h4>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (selectedJournalEntry.finished) {
                          generateCosmicComments(selectedJournalEntry);
                        } else {
                          updateJournalEntry({ ...selectedJournalEntry, finished: true });
                        }
                      }}
                      disabled={isGeneratingComments}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all duration-500",
                        isGeneratingComments 
                          ? "bg-white/5 text-white/20 cursor-not-allowed" 
                          : selectedJournalEntry.finished
                            ? "bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 border border-purple-500/30"
                            : "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/40 border border-emerald-500/30"
                      )}
                    >
                      {isGeneratingComments ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Summoning Insights...
                        </>
                      ) : selectedJournalEntry.finished ? (
                        <>
                          <Sparkles className="w-3 h-3" />
                          Invite Insight
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3" />
                          Mark as Finished
                        </>
                      )}
                    </button>
                  </div>

                  {selectedJournalEntry.comments && selectedJournalEntry.comments.length > 0 ? (
                    <div className="grid gap-6">
                      {selectedJournalEntry.comments.map((comment) => (
                        <motion.div 
                          key={comment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-4 items-start group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0 group-hover:border-purple-500/30 transition-colors">
                            {comment.botAvatar}
                          </div>
                          <div className="space-y-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-display font-bold text-white/60 uppercase tracking-widest">{comment.botName}</span>
                              <span className="w-1 h-1 rounded-full bg-white/10" />
                              <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Echoing</span>
                            </div>
                            <p className="text-sm text-white/50 font-light italic leading-relaxed">
                              "{comment.content}"
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">The family is quiet... invite them to share their wisdom.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isDeleting && selectedJournalEntry && (
            <motion.div 
              key="delete-journal-entry-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            >
              <motion.div 
                key="delete-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDeleting(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl glass-panel"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif italic text-white">Dissolve this echo?</h3>
                  <p className="text-sm text-white/40">This reflection will return to the void forever.</p>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    onClick={() => {
                      deleteJournalEntry(selectedJournalEntry.id);
                      setIsDeleting(false);
                    }}
                    className="w-full py-4 rounded-2xl bg-red-600 text-white text-xs font-mono uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-500/20"
                  >
                    Dissolve
                  </button>
                  <button 
                    onClick={() => setIsDeleting(false)}
                    className="w-full py-4 rounded-2xl bg-white/5 text-white/60 text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Maintain
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
});
