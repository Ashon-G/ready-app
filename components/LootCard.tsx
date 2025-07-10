import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Svg, Path, Defs, LinearGradient, Stop, Line } from 'react-native-svg';

export type LootCardProps = {
  title: string;
  rarity: string;
  rating: string;
  userCount: string;
  imageUri: string;
  backgroundGradient?: [string, string];
  borderGradient?: [string, string];
};

export default function LootCard({
  title,
  rarity,
  rating,
  userCount,
  imageUri,
  backgroundGradient = ['#55C267', '#41AC53'],
  borderGradient = ['#007042', '#55C267'],
}: LootCardProps) {
  return (
    <View style={styles.container}>
      <Svg style={styles.svg} width="345" height="100" viewBox="0 0 345 100" fill="none">
        <Defs>
          <LinearGradient id="bgGradient" x1="172.5" y1="0" x2="172.5" y2="100" gradientUnits="userSpaceOnUse">
            <Stop stopColor={backgroundGradient[0]} />
            <Stop offset="1" stopColor={backgroundGradient[1]} />
          </LinearGradient>
          <LinearGradient id="borderGradient" x1="0" y1="50" x2="345" y2="50" gradientUnits="userSpaceOnUse">
            <Stop stopColor={borderGradient[0]} />
            <Stop offset="1" stopColor={borderGradient[1]} />
          </LinearGradient>
        </Defs>
        <Path
          d="M288.012 0C294.666 0 300.061 5.39444 300.061 12.0488C300.061 28.0762 300.06 36.0901 305.039 41.0693C310.018 46.0485 318.032 46.0488 334.06 46.0488C340.102 46.0488 345 50.947 345 56.9893V76C345 87.3137 345 92.9706 341.485 96.4854C337.971 100 332.314 100 321 100H24C12.6863 100 7.02937 100 3.51465 96.4854C0 92.9706 0 87.3137 0 76V24C0 12.6863 0 7.02937 3.51465 3.51465C7.02937 0 12.6863 0 24 0H288.012Z"
          fill="url(#bgGradient)"
          fillOpacity={0.25}
        />
        <Path
          d="M288.012 0C294.666 0 300.061 5.39444 300.061 12.0488C300.061 28.0762 300.06 36.0901 305.039 41.0693C310.018 46.0485 318.032 46.0488 334.06 46.0488C340.102 46.0488 345 50.947 345 56.9893V76C345 87.3137 345 92.9706 341.485 96.4854C337.971 100 332.314 100 321 100H24C12.6863 100 7.02937 100 3.51465 96.4854C0 92.9706 0 87.3137 0 76V24C0 12.6863 0 7.02937 3.51465 3.51465C7.02937 0 12.6863 0 24 0H288.012Z"
          fill="url(#borderGradient)"
        />
      </Svg>
      <View style={styles.exportIcon}>
        <Text style={{ fontSize: 16 }}>↗</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rarity}>{rarity}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.stat}>⭐ {rating}</Text>
            <Svg style={styles.divider} width="1" height="20" viewBox="0 0 1 20" fill="none">
              <Line x1="0.5" y1="0" x2="0.5" y2="20" stroke="black" strokeOpacity="0.5" />
            </Svg>
            <Text style={styles.stat}>👥 {userCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 345,
    height: 100,
    position: 'relative',
    overflow: 'hidden',
  },
  svg: {
    position: 'absolute',
    width: 345,
    height: 100,
  },
  exportIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 8,
    marginLeft: 8,
  },
  imageWrapper: {
    width: 74,
    height: 74,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    justifyContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  rarity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  stat: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    marginHorizontal: 10,
  },
});

