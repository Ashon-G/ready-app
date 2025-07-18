import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '@/lib/firebase';

export default function ProfileSettings() {
  const options = [
    { icon: 'verified', title: 'Account Verification', subtitle: 'Secure accounts earn 3x more' },
    { icon: 'my-location', title: 'Location Verification', subtitle: 'Qualify for local earning opportunities' },
    { icon: 'notifications', title: 'Notifications', subtitle: "Don't miss our best surveys" },
    { icon: 'emoji-events', title: 'Achievements', subtitle: 'Earn cash bonuses for key milestones' },
    { icon: 'campaign', title: 'Referrals', subtitle: 'Earn for inviting your friends' },
    { icon: 'article', title: 'Profile', subtitle: 'Qualify for more surveys' },
    { icon: 'help-outline', title: 'Help', subtitle: 'FAQ and customer support' },
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch {}
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Profile Settings</Text>
      {options.map((opt, idx) => (
        <TouchableOpacity key={idx} style={styles.row} activeOpacity={0.8}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name={opt.icon as any} size={20} color="#fff" />
          </View>
          <View style={styles.flex}>
            <Text style={styles.title}>{opt.title}</Text>
            <Text style={styles.subtitle}>{opt.subtitle}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, marginTop: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconWrapper: { backgroundColor: '#22c55e', padding: 8, borderRadius: 9999 },
  flex: { flex: 1, marginLeft: 12 },
  title: { fontWeight: 'bold' },
  subtitle: { color: '#6b7280', fontSize: 12 },
  logout: {
    marginTop: 24,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutText: { color: '#ef4444', fontWeight: 'bold' },
});
