import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './firebase';

export interface FriendRequestNotification {
  id: string; // requester UID
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  senderSchool?: string;
  senderGrade?: string;
  timestamp?: number;
}

/**
 * Normalises a name string to Title Case.
 */
const normaliseName = (value: string): string =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase());

/**
 * Resolves display name from user document data.
 */
const resolveDisplayName = (data: Record<string, unknown>): string => {
  const profileName = [data.firstName, data.lastName]
    .map((v) => String(v || '').trim())
    .filter(Boolean)
    .join(' ');
  const googleName = String(data.displayName || data.name || data.fullName || '').trim();
  const emailName = String(data.email || '')
    .split('@')[0]
    .replace(/[._+-]+/g, ' ')
    .trim();
  return normaliseName(profileName || googleName || emailName) || 'Student';
};

/**
 * Subscribes to the current user's document in real-time to watch `friendRequests`.
 * Resolves each requester's name, school, photo from Firestore.
 */
export const subscribeToPendingFriendRequests = (
  userId: string,
  onUpdate: (data: { count: number; requests: FriendRequestNotification[] }) => void
): (() => void) => {
  if (!userId) {
    onUpdate({ count: 0, requests: [] });
    return () => {};
  }

  const userDocRef = doc(db, 'users', userId);

  const unsubscribe = onSnapshot(
    userDocRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        onUpdate({ count: 0, requests: [] });
        return;
      }

      const userData = snapshot.data();
      const rawRequests: string[] = Array.isArray(userData.friendRequests)
        ? userData.friendRequests.filter((id) => typeof id === 'string' && id.trim().length > 0)
        : [];

      if (rawRequests.length === 0) {
        onUpdate({ count: 0, requests: [] });
        return;
      }

      // Fetch profiles of requesters
      try {
        const profilePromises = rawRequests.map(async (requesterId) => {
          try {
            const reqSnap = await getDoc(doc(db, 'users', requesterId));
            if (reqSnap.exists()) {
              const reqData = reqSnap.data() as Record<string, unknown>;
              return {
                id: requesterId,
                senderId: requesterId,
                senderName: resolveDisplayName(reqData),
                senderPhoto: typeof reqData.photoURL === 'string' ? reqData.photoURL : undefined,
                senderSchool: typeof reqData.school === 'string' ? reqData.school.trim() : '',
                senderGrade: typeof reqData.grade === 'string' ? reqData.grade.trim() : '',
              } as FriendRequestNotification;
            }
          } catch (e) {
            console.debug('Error resolving requester profile:', e);
          }

          // Fallback if document not found
          return {
            id: requesterId,
            senderId: requesterId,
            senderName: 'Student',
          } as FriendRequestNotification;
        });

        const resolved = await Promise.all(profilePromises);
        onUpdate({ count: resolved.length, requests: resolved });
      } catch (err) {
        console.error('Error loading friend requests:', err);
        onUpdate({
          count: rawRequests.length,
          requests: rawRequests.map((id) => ({
            id,
            senderId: id,
            senderName: 'Student',
          })),
        });
      }
    },
    (err) => {
      console.warn('Error in friendRequests snapshot:', err);
      onUpdate({ count: 0, requests: [] });
    }
  );

  return unsubscribe;
};

/**
 * Accepts an incoming friend request.
 */
export const acceptFriendRequest = async (
  currentUserId: string,
  requesterId: string
): Promise<void> => {
  const meRef = doc(db, 'users', currentUserId);
  const themRef = doc(db, 'users', requesterId);

  await updateDoc(meRef, {
    friends: arrayUnion(requesterId),
    friendRequests: arrayRemove(requesterId),
  });

  try {
    await updateDoc(themRef, {
      friends: arrayUnion(currentUserId),
      sentRequests: arrayRemove(currentUserId),
    });
  } catch (e) {
    console.debug('Could not update requester sentRequests (best effort):', e);
  }
};

/**
 * Declines an incoming friend request.
 */
export const declineFriendRequest = async (
  currentUserId: string,
  requesterId: string
): Promise<void> => {
  const meRef = doc(db, 'users', currentUserId);
  const themRef = doc(db, 'users', requesterId);

  await updateDoc(meRef, {
    friendRequests: arrayRemove(requesterId),
  });

  try {
    await updateDoc(themRef, {
      sentRequests: arrayRemove(currentUserId),
    });
  } catch (e) {
    console.debug('Could not update requester sentRequests (best effort):', e);
  }
};
