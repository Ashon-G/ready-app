import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'expo-router';

const steps = [
  'Username',
  'Email',
  'Gender',
  'Address',
  'Phone Number',
  'Date of Birth',
  'Password',
];

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const width = Dimensions.get('window').width;
  const router = useRouter();

  const animateNext = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(width);
      setCurrentStep((s) => s + 1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSubmit = async () => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      username,
      email,
      gender,
      street,
      city,
      zip,
      phone,
      dob,
    });
    router.replace('/(tabs)');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        );
      case 1:
        return (
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        );
      case 2:
        return (
          <TextInput
            placeholder="Gender"
            style={styles.input}
            value={gender}
            onChangeText={setGender}
          />
        );
      case 3:
        return (
          <View style={{ width: '100%' }}>
            <TextInput
              placeholder="Street"
              style={styles.input}
              value={street}
              onChangeText={setStreet}
            />
            <TextInput
              placeholder="City"
              style={styles.input}
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              placeholder="Zip Code"
              style={styles.input}
              value={zip}
              onChangeText={setZip}
            />
          </View>
        );
      case 4:
        return (
          <TextInput
            placeholder="Phone number"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        );
      case 5:
        return (
          <TextInput
            placeholder="Date of Birth"
            style={styles.input}
            value={dob}
            onChangeText={setDob}
          />
        );
      case 6:
        return (
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        );
      default:
        return null;
    }
  };

  const isLast = currentStep === steps.length - 1;

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateX: slideAnim }], width: '100%' }}>
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
