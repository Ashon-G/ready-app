import React, { useEffect, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function BottomDrawer({ isOpen, onClose, children }: Props) {
  const translateY = React.useRef(new Animated.Value(screenHeight)).current;
  const [visible, setVisible] = useState(isOpen);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 100) {
          closeDrawer();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const openDrawer = () => {
    setVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onClose();
    });
  };

  useEffect(() => {
    if (isOpen) openDrawer();
    else if (visible) closeDrawer();
  }, [isOpen]);

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={closeDrawer}>
      <View
        style={[styles.backdrop, !isOpen && styles.hiddenBackdrop]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <Animated.View
          style={[styles.drawer, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          {children}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  hiddenBackdrop: {
    backgroundColor: 'transparent',
  },
  drawer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.9,
    padding: 20,
  },
});
