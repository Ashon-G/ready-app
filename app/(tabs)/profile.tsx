import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'expo-router';

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid));
        setUserData(snap.data());
      }
    });
    return unsub;
  }, []);

  if (!userData) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.item}>Username: {userData.username}</Text>
      <Text style={styles.item}>Email: {userData.email}</Text>
      <Text style={styles.item}>Phone: {userData.phone}</Text>
      <Text style={styles.item}>DOB: {userData.dob}</Text>
      <Text style={styles.item}>Gender: {userData.gender}</Text>
      <Text style={styles.item}>Country: {userData.country}</Text>
      <Text style={styles.item}>Zip: {userData.zip}</Text>
      <Button title="Settings" onPress={() => router.push('/settings')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { fontSize: 18, marginBottom: 8 },
});
