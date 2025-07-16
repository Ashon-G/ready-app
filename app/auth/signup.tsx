import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Animated } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'expo-router';

const steps = ['Phone Number', 'Date of Birth', 'Username', 'Email', 'Password'];

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const animateNext = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start(() => setCurrentStep((s) => s + 1));
  };

  const handleSubmit = async () => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      phone,
      dob,
      username,
      email,
    });
    router.replace('/(tabs)');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <TextInput placeholder="Phone" style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />;
      case 1:
        return <TextInput placeholder="Date of Birth" style={styles.input} value={dob} onChangeText={setDob} />;
      case 2:
        return <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />;
      case 3:
        return <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />;
      case 4:
        return <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />;
      default:
        return null;
    }
  };

  const isLast = currentStep === steps.length - 1;

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
        <Text style={styles.title}>{steps[currentStep]}</Text>
        {renderStep()}
      </Animated.View>
      <Button title={isLast ? 'Submit' : 'Next'} onPress={isLast ? handleSubmit : animateNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, width: '100%', marginBottom: 20, borderRadius: 4 },
});
