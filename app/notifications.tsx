import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { NovuProvider } from '@novu/react-native';
import { YourCustomInbox } from '@/components/Inbox';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function ModalScreen() {
  return (
    <>

      <NovuProvider
        applicationIdentifier="ubgnZhsROTKh"
        subscriberId="6872ff4ef703d283ddbdefc8"
      >
        <YourCustomInbox />
      </NovuProvider>
    </>
  );
}


