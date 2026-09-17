import {
  collection,
  collectionGroup,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { AiChatSession } from './aiChatHistory';

export interface UserChatStats {
  userId: string;
  chatCount: number;
  lastChatAt: Date | null;
}

export interface UserChatProfile {
  userId: string;
  name: string;
  email: string;
  chatCount: number;
  lastChatAt: Date | null;
}

const asDate = (value: unknown): Date | null => {
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  if (value && typeof value === 'object' && 'seconds' in value && typeof (value as { seconds: number }).seconds === 'number') {
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  return null;
};

const normaliseName = (value: string): string =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (letter) => letter.toUpperCase());

export const userDisplayName = (user: Record<string, unknown>): string => {
  const profileName = [user.firstName, user.lastName]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .join(' ');
  const googleName = String(user.displayName || user.name || user.fullName || '').trim();
  const emailName = String(user.email || '')
    .split('@')[0]
    .replace(/[._+-]+/g, ' ')
    .trim();

  return normaliseName(profileName || googleName || emailName) || 'Unnamed user';
};

const aggregateChatDocs = (docs: { ref: { parent: { parent: { id: string } | null } | null }; data: () => Record<string, unknown> }[]): Map<string, UserChatStats> => {
  const stats = new Map<string, UserChatStats>();

  docs.forEach((chatDoc) => {
    const userId = chatDoc.ref.parent?.parent?.id;
    if (!userId) return;

    const data = chatDoc.data();
    const updatedAt = asDate(data.updatedAt) ?? asDate(data.createdAt);
    const existing = stats.get(userId);

    if (!existing) {
      stats.set(userId, {
        userId,
        chatCount: 1,
        lastChatAt: updatedAt,
      });
      return;
    }

    existing.chatCount += 1;
    if (updatedAt && (!existing.lastChatAt || updatedAt > existing.lastChatAt)) {
      existing.lastChatAt = updatedAt;
    }
  });

  return stats;
};

const buildProfiles = (
  chatStats: Map<string, UserChatStats>,
  users: { id: string; data: Record<string, unknown> }[],
): UserChatProfile[] =>
  [...chatStats.values()]
    .map((stat) => {
      const user = users.find((item) => item.id === stat.userId);
      return {
        userId: stat.userId,
        name: user ? userDisplayName(user.data) : 'Unknown user',
        email: String(user?.data.email || ''),
        chatCount: stat.chatCount,
        lastChatAt: stat.lastChatAt,
      };
    })
    .sort((a, b) => {
      const timeA = a.lastChatAt?.getTime() ?? 0;
      const timeB = b.lastChatAt?.getTime() ?? 0;
      return timeB - timeA;
    });

export const loadUserChatProfiles = async (): Promise<UserChatProfile[]> => {
  try {
    const [chatSnapshot, userSnapshot] = await Promise.all([
      getDocs(collectionGroup(db, 'aiChats')),
      getDocs(collection(db, 'users')),
    ]);

    const users = userSnapshot.docs.map((item) => ({ id: item.id, data: item.data() as Record<string, unknown> }));
    const chatStats = aggregateChatDocs(chatSnapshot.docs);
    return buildProfiles(chatStats, users);
  } catch (err) {
    console.warn('loadUserChatProfiles falling back to per-user queries', err);
    const userSnapshot = await getDocs(collection(db, 'users'));
    const users = userSnapshot.docs.map((item) => ({ id: item.id, data: item.data() as Record<string, unknown> }));
    const results = await Promise.all(
      users.map(async (u) => {
        try {
          const snap = await getDocs(collection(db, 'users', u.id, 'aiChats'));
          return snap.docs;
        } catch {
          return [];
        }
      }),
    );
    const chatStats = aggregateChatDocs(results.flat());
    return buildProfiles(chatStats, users);
  }
};

export const subscribeToUserChatProfiles = (
  onChange: (profiles: UserChatProfile[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  let users: { id: string; data: Record<string, unknown> }[] = [];
  let chatStats = new Map<string, UserChatStats>();
  let hasChatData = false; // guard: only publish once we have real chat stats

  const publish = () => {
    if (!hasChatData) return; // wait until chat data is available before showing results
    onChange(buildProfiles(chatStats, users));
  };

  const loadFromPerUserSubcollections = async () => {
    if (users.length === 0) return;
    try {
      const results = await Promise.all(
        users.map(async (u) => {
          try {
            const snap = await getDocs(collection(db, 'users', u.id, 'aiChats'));
            return snap.docs;
          } catch {
            return [];
          }
        }),
      );
      chatStats = aggregateChatDocs(results.flat());
      hasChatData = true;
      publish();
    } catch (fallbackErr) {
      onError?.(fallbackErr as Error);
    }
  };

  const stopUsers = onSnapshot(
    collection(db, 'users'),
    (snapshot) => {
      users = snapshot.docs.map((item) => ({ id: item.id, data: item.data() as Record<string, unknown> }));
      publish(); // no-op until hasChatData is true
    },
    (error) => onError?.(error),
  );

  // Unsorted collectionGroup query does not require a composite index; aggregation is done in memory
  const chatsQuery = query(collectionGroup(db, 'aiChats'));
  const stopChats = onSnapshot(
    chatsQuery,
    (snapshot) => {
      chatStats = aggregateChatDocs(snapshot.docs);
      hasChatData = true;
      publish();
    },
    (error) => {
      console.warn('admin chat tracker falling back to per-user chat collection queries', error);
      void loadFromPerUserSubcollections();
    },
  );

  return () => {
    stopUsers();
    stopChats();
  };
};

export const loadUserChatSessions = async (userId: string): Promise<AiChatSession[]> => {
  try {
    const q = query(
      collection(db, 'users', userId, 'aiChats'),
      orderBy('updatedAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as Omit<AiChatSession, 'id'>),
    }));
  } catch {
    const snapshot = await getDocs(collection(db, 'users', userId, 'aiChats'));
    const sessions = snapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as Omit<AiChatSession, 'id'>),
    }));
    sessions.sort((a, b) => {
      const timeA = asDate(a.updatedAt)?.getTime() ?? 0;
      const timeB = asDate(b.updatedAt)?.getTime() ?? 0;
      return timeB - timeA;
    });
    return sessions;
  }
};
