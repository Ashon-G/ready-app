import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';

export type MenuTabProps = {
  label: string;
  focused?: boolean;
};

export default function MenuTab({ label, focused }: MenuTabProps) {
  return (
    <View
      style={[
        styles.menuTabContainer,
        focused && styles.activeContainer,
      ]}
    >
      <Svg
        style={styles.group}
        width={25}
        height={24}
        viewBox="0 0 25 24"
        fill="none"
      >
        <Path d="M22 12.7995V21L15.7448 14.9548L15.0688 15.6051L13 17.6074L10.2552 14.9548L4 21V12.7995L8.7588 8.20345L10.001 7V9.40395L10.9281 10.3014L12.1551 11.4872L13 12.3037L13.8434 11.4872L15.0688 10.3029L15.999 9.40395V7L22 12.7995Z" fill="#A68763" />
        <Path d="M15 2.50097L14.2673 3.23373V8.23308L12.5006 10L10.734 8.23308V3.23373L10 2.50097L10.734 1.76692L12.5006 0L14.2673 1.76692L15 2.50097Z" fill="#A68763" />
        <Path d="M17 20.857V23.9954L13.0016 20.143L9 24V20.857L13.0016 17L14.6342 18.5715L17 20.857Z" fill="#A68763" />
      </Svg>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  menuTabContainer: {
    position: 'relative',
    flexShrink: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 0,
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: 6,
    padding: 10,
    borderColor: 'transparent',
  },
  activeContainer: {
    borderColor: 'rgba(255, 240, 169, 1)',
  },
  group: {
    position: 'relative',
    flexShrink: 0,
    height: 24,
    width: 24,
  },
  label: {
    position: 'relative',
    flexShrink: 0,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Rajdhani',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 14,
  },
});
