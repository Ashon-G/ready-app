import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import Animated, { Layout } from 'react-native-reanimated';
import { useNotifications } from '@novu/react-native';
import NotificationItem from './NotificationItem';

type Notification = {
  id: string;
  title?: string;
  body: string;
  createdAt: string;
};

const AnimatedFlatList = Animated.FlatList<Notification>;

export function YourCustomInbox() {
  const { notifications, isLoading, fetchMore, hasMore, refetch } = useNotifications();
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AnimatedFlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NotificationItem item={item} onRemove={handleRemove} />}
      contentContainerStyle={styles.list}
      layout={Layout.springify()}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        hasMore ? <ActivityIndicator style={{ marginTop: 16 }} /> : null
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>🎉 You're all caught up!</Text>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          colors={['#007AFF']}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 48 },
  empty: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: '#999' },
});
