/**
 * aiChatHistory.ts
 * Firestore helpers for Sidemann AI chat sessions, saved notes, and daily token usage.
 *
 * Firestore structure:
 *   users/{uid}/aiChats/{chatId}
 *     title: string          – first 60 chars of the first user message
 *     createdAt: Timestamp
 *     updatedAt: Timestamp
 *     messages: StoredChatMessage[]
 *
 *   users/{uid}/aiNotes/{noteId}
 *     title: string
 *     content: string
 *     chatId: string
 *     messageId: string
 *     createdAt: Timestamp
 *
 *   users/{uid}/aiTokens/{YYYY-MM-DD}
 *     used: number           – cumulative tokens used today (approx)
 */

import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  limit,
  increment,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StoredChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  text: string;
}

export interface AiChatSession {
  id: string;
  title: string;
  createdAt: any;
  updatedAt: any;
  messages: StoredChatMessage[];
}

export interface AiSavedNote {
  id: string;
  title: string;
  content: string;
  chatId: string;
  messageId: string;
  createdAt: any;
}

export interface DailyTokenDoc {
  used: number;
  date: string;
}

export const DAILY_TOKEN_LIMIT = 1_000_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const todayKey = () => new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

const chatsRef = (uid: string) =>
  collection(db, 'users', uid, 'aiChats');

const chatDocRef = (uid: string, chatId: string) =>
  doc(db, 'users', uid, 'aiChats', chatId);

const notesRef = (uid: string) =>
  collection(db, 'users', uid, 'aiNotes');

const tokenDocRef = (uid: string) =>
  doc(db, 'users', uid, 'aiTokens', todayKey());

// ---------------------------------------------------------------------------
// Chat History
// ---------------------------------------------------------------------------

/** Create a new chat session ID or generate one locally. */
export const createChatSessionId = (uid: string): string => {
  return doc(chatsRef(uid)).id;
};

/** Save / update a full chat session in Firestore. */
export const saveChatSession = async (
  uid: string,
  chatId: string,
  messages: StoredChatMessage[],
  title?: string,
): Promise<void> => {
  if (!uid || !chatId || !Array.isArray(messages) || messages.length === 0) return;

  const firstUserMsg = messages.find((m) => m.role === 'user');
  const chatTitle =
    title?.trim().slice(0, 60) ||
    firstUserMsg?.text.replace(/[#*`\n]/g, ' ').trim().slice(0, 60) ||
    'New Chat';

  const docRef = chatDocRef(uid, chatId);
  
  try {
    const snap = await getDoc(docRef);
    const payload: any = {
      title: chatTitle,
      messages,
      updatedAt: serverTimestamp(),
    };

    if (!snap.exists() || !snap.data()?.createdAt) {
      payload.createdAt = serverTimestamp();
    }

    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    console.error('Error saving chat session:', error);
    // Fallback direct setDoc
    await setDoc(
      docRef,
      {
        title: chatTitle,
        messages,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
};

/** Real-time subscription to user's chat sessions. */
export const subscribeToChatSessions = (
  uid: string,
  onChange: (sessions: AiChatSession[]) => void,
): Unsubscribe => {
  const q = query(chatsRef(uid), orderBy('updatedAt', 'desc'), limit(40));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AiChatSession, 'id'>),
      }));
      onChange(list);
    },
    (error) => {
      console.warn('subscribeToChatSessions fallback to unsorted query', error);
      // Fallback in case composite index is not yet built
      getDocs(chatsRef(uid)).then((snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AiChatSession, 'id'>),
        }));
        list.sort((a, b) => {
          const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
          const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
          return timeB - timeA;
        });
        onChange(list);
      });
    },
  );
};

/** Load the 40 most recent sessions (title + dates). */
export const loadChatSessions = async (uid: string): Promise<AiChatSession[]> => {
  try {
    const q = query(chatsRef(uid), orderBy('updatedAt', 'desc'), limit(40));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<AiChatSession, 'id'>),
    }));
  } catch {
    const snapshot = await getDocs(chatsRef(uid));
    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<AiChatSession, 'id'>),
    }));
    list.sort((a, b) => {
      const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
      const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
      return timeB - timeA;
    });
    return list;
  }
};

/** Load a single session with full messages. */
export const loadChatSession = async (
  uid: string,
  chatId: string,
): Promise<AiChatSession | null> => {
  const snap = await getDoc(chatDocRef(uid, chatId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<AiChatSession, 'id'>) };
};

// ---------------------------------------------------------------------------
// AI Saved Notes
// ---------------------------------------------------------------------------

export const saveAiNote = async (
  uid: string,
  note: {
    title?: string;
    content: string;
    chatId?: string;
    messageId?: string;
  },
): Promise<string> => {
  const title =
    note.title?.trim().slice(0, 120) ||
    note.content.replace(/[#*`\n]/g, ' ').trim().slice(0, 60) ||
    'Study Note';

  const ref = await addDoc(notesRef(uid), {
    title,
    content: note.content.slice(0, 50000),
    chatId: note.chatId || '',
    messageId: note.messageId || '',
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const deleteAiNote = async (uid: string, noteId: string): Promise<void> => {
  await deleteDoc(doc(db, 'users', uid, 'aiNotes', noteId));
};

export const subscribeToAiNotes = (
  uid: string,
  onChange: (notes: AiSavedNote[]) => void,
): Unsubscribe => {
  const q = query(notesRef(uid), orderBy('createdAt', 'desc'), limit(20));
  return onSnapshot(
    q,
    (snap) => {
      onChange(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AiSavedNote, 'id'>),
        })),
      );
    },
    () => {
      getDocs(notesRef(uid)).then((snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AiSavedNote, 'id'>),
        }));
        list.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });
        onChange(list);
      });
    },
  );
};

// ---------------------------------------------------------------------------
// Token Tracking
// ---------------------------------------------------------------------------

/**
 * Atomically add `count` tokens to today's document.
 * Uses setDoc with merge so the doc is created on first write.
 */
export const incrementDailyTokens = async (uid: string, count: number): Promise<void> => {
  const ref = tokenDocRef(uid);
  await setDoc(
    ref,
    { used: increment(count), date: todayKey() },
    { merge: true },
  );
};

/**
 * Subscribe to the today's token document in real-time.
 * Returns an unsubscribe function.
 */
export const subscribeToTokens = (
  uid: string,
  onChange: (used: number) => void,
): Unsubscribe => {
  return onSnapshot(tokenDocRef(uid), (snap) => {
    if (snap.exists()) {
      onChange((snap.data() as DailyTokenDoc).used ?? 0);
    } else {
      onChange(0);
    }
  });
};

/**
 * Estimate token count from text length (approx 4 chars per token).
 */
export const estimateTokens = (text: string): number =>
  Math.ceil(text.length / 4);
