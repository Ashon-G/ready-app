import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function updateUserStreak(userId: string): Promise<number> {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  const data: any = snap.data() || {};

  const last: Date | undefined = data.lastActivity?.toDate
    ? data.lastActivity.toDate()
    : data.lastActivity
    ? new Date(data.lastActivity)
    : undefined;
  const today = new Date();
  const todayStr = today.toDateString();
  let streak = data.streak || 0;

  if (last && new Date(last).toDateString() === todayStr) {
    // already counted today
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (last && new Date(last).toDateString() === yesterday.toDateString()) {
      streak += 1;
    } else {
      streak = 1;
    }
    await setDoc(ref, { streak, lastActivity: today }, { merge: true });
  }
  return streak;
}
