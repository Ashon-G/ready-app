import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Notification = {
  id: string;
  title?: string;
  body: string;
  createdAt: string;
};

type Props = {
  item: Notification;
  onRemove: (id: string) => void;
};

export default function NotificationItem({ item, onRemove }: Props) {
  const handlePress = () => {
    onRemove(item.id); // 💥 gone
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.row}>
          <MaterialIcons name="notifications" size={22} color="#007AFF" style={styles.icon} />
          <View style={styles.content}>
            <Text style={styles.title}>{item.title ?? 'Notification'}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  icon: { marginRight: 12, marginTop: 2 },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  body: { fontSize: 14, marginBottom: 6, color: '#333' },
  time: { fontSize: 12, color: '#999', textAlign: 'right' },
});
