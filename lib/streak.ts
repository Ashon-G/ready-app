import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export type StreakInfo = {
  streak: number;
  extendedToday: boolean;
  progress: number;
  achievements: {
    daily: number;
    weekly: number;
    monthly: number;
  };
};

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

export async function updateUserStreak(userId: string): Promise<StreakInfo> {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  const data: any = snap.data() || {};

  const last: Date | undefined = data.lastActivity?.toDate
    ? data.lastActivity.toDate()
    : data.lastActivity
    ? new Date(data.lastActivity)
    : undefined;
  const today = new Date();
  let streak = data.streak || 0;
  let progress = data.achievementProgress || 0;
  const achievements = data.achievements || { daily: 0, weekly: 0, monthly: 0 };
  let extendedToday = false;

  const earnings = data.earnings || 0;
  const lastEarnTotal = data.lastEarnTotal || 0;
  const earnedDiff = parseFloat((earnings - lastEarnTotal).toFixed(2));

  if (!last || !sameDay(last, today)) {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (earnedDiff >= 0.01) {
      if (last && sameDay(last, yesterday)) {
        streak += 1;
      } else {
        streak = 1;
      }
      progress += 1;
      extendedToday = true;

      if (progress === 3) {
        achievements.daily = (achievements.daily || 0) + 1;
      } else if (progress === 10) {
        achievements.weekly = (achievements.weekly || 0) + 1;
      } else if (progress === 30) {
        achievements.monthly = (achievements.monthly || 0) + 1;
        progress = 0;
      }

      await setDoc(
        ref,
        {
          streak,
          lastActivity: today,
          lastEarnTotal: earnings,
          achievementProgress: progress,
          achievements,
        },
        { merge: true }
      );
    } else if (!last || !sameDay(last, yesterday)) {
      // missed a day without earning
      streak = 0;
      await setDoc(ref, { streak }, { merge: true });
    }
  }

  // apply recurring bonuses without affecting streak
  let updated = false;
  const updates: any = {};
  let total = earnings;

  if (achievements.daily > 0) {
    const lastDaily: Date | undefined = data.lastDailyBonus?.toDate
      ? data.lastDailyBonus.toDate()
      : data.lastDailyBonus
      ? new Date(data.lastDailyBonus)
      : undefined;
    if (!lastDaily || !sameDay(lastDaily, today)) {
      total += achievements.daily * 0.01;
      updates.lastDailyBonus = today;
      updated = true;
    }
  }

  if (achievements.weekly > 0) {
    const lastWeekly: Date | undefined = data.lastWeeklyBonus?.toDate
      ? data.lastWeeklyBonus.toDate()
      : data.lastWeeklyBonus
      ? new Date(data.lastWeeklyBonus)
      : undefined;
    if (!lastWeekly || today.getTime() - lastWeekly.getTime() >= 7 * 864e5) {
      total += achievements.weekly * 0.05;
      updates.lastWeeklyBonus = today;
      updated = true;
    }
  }

  if (achievements.monthly > 0) {
    const lastMonthly: Date | undefined = data.lastMonthlyBonus?.toDate
      ? data.lastMonthlyBonus.toDate()
      : data.lastMonthlyBonus
      ? new Date(data.lastMonthlyBonus)
      : undefined;
    if (
      !lastMonthly ||
      lastMonthly.getFullYear() !== today.getFullYear() ||
      lastMonthly.getMonth() !== today.getMonth()
    ) {
      total += achievements.monthly * 0.25;
      updates.lastMonthlyBonus = today;
      updated = true;
    }
  }

  if (updated) {
    updates.earnings = parseFloat(total.toFixed(2));
    updates.lastEarnTotal = parseFloat(total.toFixed(2));
    await setDoc(ref, updates, { merge: true });
  }

  return { streak, extendedToday, progress, achievements };
}
