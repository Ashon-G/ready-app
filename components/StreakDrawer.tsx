import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import BottomDrawer from './BottomDrawer';

export type StreakDrawerProps = {
  visible: boolean;
  onClose: () => void;
  streak: number;
};

const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function StreakDrawer({ visible, onClose, streak }: StreakDrawerProps) {
  const dayCircles = weekDays.map((d, i) => {
    const active = i < streak % 7;
    return (
      <View key={d} style={styles.dayItem}>
        <View style={[styles.dayCircle, active && styles.dayCircleActive]}>
          {active && <Text style={styles.check}>✓</Text>}
        </View>
        <Text style={[styles.dayLabel, !active && styles.dayLabelInactive]}>{d}</Text>
      </View>
    );
  });

  return (
    <BottomDrawer isOpen={visible} onClose={onClose}>
      <ScrollView>
        <View style={styles.noteRow}>
          <Text style={styles.noteText}>A streak counts how many days you've earned money in a row</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.center}>
          <View style={styles.flameWrap}>
            <Image
              source={{ uri: 'https://img.icons8.com/color/96/fire-element.png' }}
              style={styles.flame}
            />
          </View>
          <Text style={styles.title}>You've earned</Text>
          <Text style={[styles.title, { marginBottom: 24 }]}>every day, for <Text style={styles.highlight}>{streak} days!</Text></Text>
        </View>

        <View style={styles.week}>{dayCircles}</View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>You've extended your streak today!</Text>
        </View>

        <View style={{ marginTop: 24 }}>
          <View style={styles.achieveHeader}>
            <Text style={styles.achieveIcon}>🏆</Text>
            <Text style={styles.achieveTitle}>Achievements</Text>
          </View>
          <View style={styles.achievementRow}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu-9379NEIhyuc-qrnn-pMNLldUEx_qL2YX_Xby7594M5tsXcHSRdwOqp4oae5lpGB23tDhvW_Sj2udU-2HLAt4YXVEQsgNgHi05-j78qh4NKC3ZME3T8nL1YvMghqtcryMN42UQkNWQDqywNYZV_vtCeoOa4Pl6vHS2cN0nJFIdfOowuZtzMfSLHMGeY9T9fl3iXeBN3fvWjjphrnQMnZodnNwuUNKpuqisnkxKLPWiqENZIRrgfsaN2biMC8yYxVSLdfgkUAcR8' }}
              style={styles.achievementIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.achieveName}>Hat Trick</Text>
              <Text style={styles.achieveSub}>3 day streak</Text>
              <View style={styles.progressBar}><View style={[styles.progressInner,{width:'100%'}]}/></View>
            </View>
            <Text style={styles.earned}>5¢ earned</Text>
          </View>
          <View style={styles.achievementRow}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYG5vWq8eEVpAfmmIJxYkAOzEFvzt5JqyYSKypwHuU6XHkI8sSXJXf3U7a27TcJGuto2Dg9EzOSMWqNhqEF8GYllKFtoNDjWSqK7YoBM7eUB-wlkSY8Tj5EYWEK4fyM2iPWhEetIz6VwvUBqPMLsn6NDQX3ZpMn7zsISzT1xy5PSnkTXoSARD_q-l86KQcZJasI7m9KpbqHjNAbcWlvk7sMbZ9ErC0mdrWpYg27aRgPjNfojjd3AiytEccedSp-hgmJqEwCDLrnt4' }}
              style={styles.achievementIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.achieveName}>007</Text>
              <Text style={styles.achieveSub}>3/7 day streak</Text>
              <View style={styles.progressBar}><View style={[styles.progressInner,{width:'42%'}]}/></View>
            </View>
            <View style={styles.reward}><Text style={styles.rewardText}>10¢</Text></View>
          </View>
          <View style={styles.achievementRow}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYnn66h-_NrEiQfe7ZKhGKIl946-ivWg3lAJJTNtTcsQ4KO1Wz5sbhlRaBp7eVHAFOgITVtwzHBrQQOXYzl36HSP1pjdrUWHqB6auvuhOFrt4sD0AX9d827wa9ZbInejc_6MYMEAwrJo0XCbrvFml1IHErKFKdzFeWrbjftX4_WtQLQSMG3k_gRTIxzH5dpxwTaH1LqBhj2sucmjfq-gOSWkKJQjpGDN8WtildnuMreAlgzpV1GDlyIDFECV4CCxAUXUXhUh9Qi7c' }}
              style={styles.achievementIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.achieveName}>Dirty Thirty</Text>
              <Text style={styles.achieveSub}>3/30 day streak</Text>
              <View style={styles.progressBar}><View style={[styles.progressInner,{width:'10%'}]}/></View>
            </View>
            <View style={styles.reward}><Text style={styles.rewardText}>75¢</Text></View>
          </View>
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={onClose}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </BottomDrawer>
  );
}

const styles = StyleSheet.create({
  noteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  noteText: { flex: 1, color: '#374151', fontSize: 12 },
  close: { color: '#6B7280', fontSize: 16, marginLeft: 8 },
  center: { alignItems: 'center' },
  flameWrap: { backgroundColor: '#FEF3C7', padding: 24, borderRadius: 24, marginBottom: 16 },
  flame: { width: 80, height: 80 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  highlight: { backgroundColor: '#FDE68A', paddingHorizontal: 4, borderRadius: 4 },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 16,
  },
  dayItem: { alignItems: 'center' },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: { backgroundColor: '#FBBF24' },
  dayLabel: { fontSize: 12, color: '#6B7280' },
  dayLabelInactive: { color: '#9CA3AF' },
  check: { color: '#fff', fontSize: 14 },
  infoBox: { backgroundColor: '#fff', borderRadius: 8, padding: 8, alignItems: 'center' },
  infoText: { fontSize: 12, fontWeight: '500', color: '#374151' },
  achieveHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  achieveIcon: { fontSize: 20, color: '#7C3AED', marginRight: 4 },
  achieveTitle: { fontWeight: 'bold', fontSize: 18 },
  achievementRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  achievementIcon: { width: 56, height: 56, marginRight: 12 },
  achieveName: { fontWeight: 'bold' },
  achieveSub: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressInner: { height: '100%', backgroundColor: '#34D399', borderRadius: 4 },
  earned: { fontWeight: 'bold', color: '#10B981' },
  reward: { backgroundColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  rewardText: { fontWeight: 'bold', color: '#374151' },
  continueBtn: { marginTop: 24, borderWidth: 2, borderColor: '#D1D5DB', borderRadius: 9999, paddingVertical: 12, alignItems: 'center' },
  continueText: { fontWeight: 'bold', color: '#111827' },
});
