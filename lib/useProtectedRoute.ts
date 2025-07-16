import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { router, useSegments } from 'expo-router';
import { auth } from './firebase';

export default function useProtectedRoute() {
  const segments = useSegments();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const inAuth = segments[0] === 'auth';
      if (!user && !inAuth) {
        router.replace('/auth/login');
      } else if (user && inAuth) {
        router.replace('/(tabs)');
      }
    });
    return unsub;
  }, [segments]);
}
