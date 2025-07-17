import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'expo-router';

const steps = [
  'Phone Number',
  'Date of Birth',
  'Gender (m/f)',
  'Country Code',
  'Zip Code',
  'Username',
  'Email',
  'Password',
];

const lottieUrls = [
  'https://lottie.host/b536c4a2-ad82-4794-a19a-0daf2145d501/Soimw5P3kL.lottie',
  'https://lottie.host/b413fdeb-2c12-400e-8fbe-50cb2a62b931/a2s38Nr2Xe.lottie',
  'https://lottie.host/848fa07e-f8f7-41dd-bdf0-8a7e167ff05f/qxZbh0lIXG.lottie',
  'https://lottie.host/0e87d4f0-0b1a-43b7-8a08-caaa43e4ff11/zmjChbFSNi.lottie',
];

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');
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
      gender,
      country,
      zip,
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
        return <TextInput placeholder="Gender" style={styles.input} value={gender} onChangeText={setGender} />;
      case 3:
        return <TextInput placeholder="Country Code" style={styles.input} value={country} onChangeText={setCountry} />;
      case 4:
        return <TextInput placeholder="Zip Code" style={styles.input} value={zip} onChangeText={setZip} />;
      case 5:
        return <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />;
      case 6:
        return <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />;
      case 7:
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
        {currentStep < lottieUrls.length && (
          <LottieView
            source={{ uri: lottieUrls[currentStep] }}
            autoPlay
            loop
            style={styles.lottie}
          />
        )}
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
  lottie: { width: 150, height: 150, marginBottom: 20, alignSelf: 'center' },
});
