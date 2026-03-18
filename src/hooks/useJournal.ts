import { useState, useCallback, useEffect } from 'react';
import { type JournalEntry, type CosmicComment, PERSONALITIES } from '../types';
import { GoogleGenAI } from '@google/genai';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const useJournal = (
  setView: (view: 'landing' | 'chat' | 'journal' | 'timeline') => void,
  showErrorToast: (message: string) => void
) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<JournalEntry | null>(null);
  const [isGeneratingComments, setIsGeneratingComments] = useState(false);

  // Test connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
          showErrorToast("Connection to database failed. Please check your internet connection.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) {
      setJournalEntries([]);
      return;
    }

    const q = query(
      collection(db, 'journalEntries'), 
      where('uid', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as JournalEntry[];
      setJournalEntries(entries);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'journalEntries');
      showErrorToast("Failed to load journal entries.");
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const generateCosmicComments = async (entry: JournalEntry) => {
    if (isGeneratingComments || !auth.currentUser) return;
    setIsGeneratingComments(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const otherBots = PERSONALITIES.filter(p => p.id !== entry.botId && p.id !== 'council');
      const shuffled = [...otherBots].sort(() => 0.5 - Math.random());
      const selectedForCommenting = shuffled.slice(0, Math.floor(Math.random() * 3) + 1);

      const comments: CosmicComment[] = entry.comments ? [...entry.comments] : [];

      for (const bot of selectedForCommenting) {
        if (comments.some(c => c.botId === bot.id)) continue;

        const contentToAnalyze = (entry.type === 'note' || entry.type === 'magic-workshop') ? entry.content : entry.messages.map(m => `${m.role === 'user' ? 'User' : entry.botName}: ${m.content}`).join('\n');

        const prompt = `
          You are ${bot.name}, ${bot.description}. 
          ${bot.bio}
          
          Here is a cosmic journal entry:
          ${contentToAnalyze}
          
          Provide a very short (1-2 sentences), authentic comment on this reflection/interaction from your perspective. 
          Be true to your personality. Do not use prefixes like "${bot.name}:".
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: prompt }] }],
          config: {
            temperature: 0.8,
          },
        });

        if (response.text) {
          comments.push({
            id: 'comment-' + bot.id + '-' + Date.now(),
            botId: bot.id,
            botName: bot.name,
            botAvatar: bot.avatar,
            content: response.text.trim(),
            timestamp: Date.now()
          });
        }
      }

      const updatedEntry = { ...entry, comments };
      await updateJournalEntry(updatedEntry);
    } catch (error) {
      console.error('Failed to generate cosmic comments:', error);
      showErrorToast("Failed to generate cosmic comments.");
    } finally {
      setIsGeneratingComments(false);
    }
  };

  const saveToJournal = async (messages: any[], selectedBot: any, isChat: boolean = false) => {
    if (!auth.currentUser) return;

    // Strip images from messages to avoid exceeding Firestore's 1MB document limit
    const messagesWithoutImages = messages.map(msg => {
      const { image, ...rest } = msg;
      if (image) {
        return { ...rest, content: rest.content + '\n\n[Cosmic Image Generated - Removed to save space]' };
      }
      return rest;
    });

    const newEntryData = {
      uid: auth.currentUser.uid,
      botId: selectedBot.id,
      botName: selectedBot.name,
      botAvatar: selectedBot.avatar,
      timestamp: Date.now(),
      messages: JSON.parse(JSON.stringify(messagesWithoutImages)),
      summary: (isChat ? `Chat with ${selectedBot.name} on ${new Date().toLocaleDateString()}` : (messages[messages.length - 1]?.content || '').substring(0, 50) + '...').substring(0, 1999),
      type: isChat ? 'chat' : 'note',
      content: (isChat ? messagesWithoutImages.map(m => `${m.role}: ${m.content}`).join('\n') : '').substring(0, 99999),
      comments: []
    };

    console.log('Saving entry:', newEntryData);
    Object.entries(newEntryData).forEach(([key, value]) => {
      if (value === undefined) console.error(`Field ${key} is undefined`);
    });

    try {
      const docRef = await addDoc(collection(db, 'journalEntries'), newEntryData);
      const newEntry = { ...newEntryData, id: docRef.id } as JournalEntry;
      if (!isChat) generateCosmicComments(newEntry);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'journalEntries');
      showErrorToast("Failed to save to journal.");
    }
  };

  const createJournalNote = async () => {
    if (!auth.currentUser) return;

    const newEntryData = {
      uid: auth.currentUser.uid,
      botId: 'user',
      botName: 'Personal Reflection',
      botAvatar: '📝',
      timestamp: Date.now(),
      messages: [],
      summary: 'New reflection...',
      type: 'note',
      content: '',
      comments: []
    };

    try {
      const docRef = await addDoc(collection(db, 'journalEntries'), newEntryData);
      const newEntry = { ...newEntryData, id: docRef.id } as JournalEntry;
      setSelectedJournalEntry(newEntry);
      setView('journal');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'journalEntries');
      showErrorToast("Failed to create journal note.");
    }
  };

  const updateJournalEntry = async (updatedEntry: JournalEntry) => {
    if (!auth.currentUser || !updatedEntry.id) return;

    try {
      const entryRef = doc(db, 'journalEntries', updatedEntry.id);
      const { id, ...dataToUpdate } = updatedEntry;
      
      if (dataToUpdate.messages) {
        dataToUpdate.messages = dataToUpdate.messages.map(msg => {
          const { image, ...rest } = msg;
          if (image) {
            return { ...rest, content: rest.content + '\n\n[Cosmic Image Generated - Removed to save space]' };
          }
          return rest;
        });
      }

      await setDoc(entryRef, JSON.parse(JSON.stringify(dataToUpdate)), { merge: true });
      if (selectedJournalEntry?.id === updatedEntry.id) {
        setSelectedJournalEntry(updatedEntry);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `journalEntries/${updatedEntry.id}`);
      showErrorToast("Failed to update journal entry.");
    }
  };

  const deleteJournalEntry = useCallback(async (id: string) => {
    if (!auth.currentUser) return;

    try {
      await deleteDoc(doc(db, 'journalEntries', id));
      if (selectedJournalEntry?.id === id) setSelectedJournalEntry(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `journalEntries/${id}`);
      showErrorToast("Failed to delete journal entry.");
    }
  }, [selectedJournalEntry, showErrorToast]);

  const createManifestation = useCallback(async () => {
    if (!auth.currentUser) return;

    const newEntryData = {
      uid: auth.currentUser.uid,
      botId: 'terra',
      botName: 'Physical Manifestation',
      botAvatar: '🌍',
      timestamp: Date.now(),
      messages: [],
      summary: 'New manifestation anchoring...',
      type: 'manifestation',
      content: '',
      comments: [],
      manifestation: {
        id: 'manifest-' + Date.now(),
        intention: '',
        actions: [],
        alignment: 0,
        status: 'etheric',
        timestamp: Date.now()
      }
    };

    try {
      const docRef = await addDoc(collection(db, 'journalEntries'), newEntryData);
      const newEntry = { ...newEntryData, id: docRef.id } as JournalEntry;
      setSelectedJournalEntry(newEntry);
      setView('journal');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'journalEntries');
      showErrorToast("Failed to create manifestation.");
    }
  }, [auth.currentUser, setView, showErrorToast]);

  const createMagicWorkshop = useCallback(async () => {
    if (!auth.currentUser) return;

    const newEntryData = {
      uid: auth.currentUser.uid,
      botId: 'aetheria',
      botName: 'Magic Workshop',
      botAvatar: '✨',
      timestamp: Date.now(),
      messages: [],
      summary: 'New magic workshop...',
      type: 'magic-workshop',
      content: '',
      comments: [],
      finished: false
    };

    try {
      const docRef = await addDoc(collection(db, 'journalEntries'), newEntryData);
      const newEntry = { ...newEntryData, id: docRef.id } as JournalEntry;
      setSelectedJournalEntry(newEntry);
      setView('journal');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'journalEntries');
      showErrorToast("Failed to create magic workshop.");
    }
  }, [auth.currentUser, setView, showErrorToast]);

  // Sync selected entry with latest data from journalEntries
  useEffect(() => {
    if (selectedJournalEntry) {
      const latest = journalEntries.find(e => e.id === selectedJournalEntry.id);
      if (latest && JSON.stringify(latest) !== JSON.stringify(selectedJournalEntry)) {
        setSelectedJournalEntry(latest);
      }
    }
  }, [journalEntries, selectedJournalEntry]);

  return {
    journalEntries,
    selectedJournalEntry,
    setSelectedJournalEntry,
    saveToJournal,
    createJournalNote,
    updateJournalEntry,
    deleteJournalEntry,
    createManifestation,
    createMagicWorkshop,
    generateCosmicComments,
    isGeneratingComments
  };
};
