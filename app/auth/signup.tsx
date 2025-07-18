import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "expo-router";

const steps = [
  "Username",
  "Email",
  "Gender",
  "Address",
  "Phone Number",
  "Date of Birth",
  "Password",
];

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const slideAnim = useRef(new Animated.Value(0)).current;
  const width = Dimensions.get("window").width;
  const router = useRouter();

  const animateNext = async () => {
    // Validate before going next
    if (currentStep === 0 && !(await isUsernameUnique(username))) {
      Alert.alert("Username already taken");
      return;
    }
    if (currentStep === 1 && !validateEmail(email)) {
      Alert.alert("Enter a valid email");
      return;
    }
    if (currentStep === 2 && !gender) {
      Alert.alert("Select a gender");
      return;
    }
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

  const isUsernameUnique = async (name: string) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", name));
    const snap = await getDocs(q);
    return snap.empty;
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        username,
        email,
        gender,
        street,
        city,
        zip,
        phone,
        dob,
      });
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Signup Error", err.message);
    }
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
            autoCapitalize="none"
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
            autoCapitalize="none"
          />
        );
      case 2:
        return (
          <View style={styles.genderContainer}>
            {["Male", "Female"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.genderBubble,
                  gender === option && styles.genderSelected,
                ]}
                onPress={() => setGender(option)}
              >
                <Text
                  style={
                    gender === option
                      ? styles.genderTextSelected
                      : styles.genderText
                  }
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 3:
        return (
          <View style={{ width: "100%" }}>
            <TextInput
              placeholder="Street"
              style={styles.input}
              value={street}
              onChangeText={setStreet}
              autoComplete="street-address"
            />
            <TextInput
              placeholder="City"
              style={styles.input}
              value={city}
              onChangeText={setCity}
              autoComplete="address-level2"
            />
            <TextInput
              placeholder="Zip Code"
              style={styles.input}
              value={zip}
              onChangeText={setZip}
              keyboardType="number-pad"
              autoComplete="postal-code"
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
            autoComplete="tel"
          />
        );
      case 5:
        return (
          <TextInput
            placeholder="Date of Birth (YYYY-MM-DD)"
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            keyboardType="numbers-and-punctuation"
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
      <Animated.View
        style={{ transform: [{ translateX: slideAnim }], width: "100%" }}
      >
        <Text style={styles.title}>{steps[currentStep]}</Text>
        {renderStep()}
      </Animated.View>
      <Button
        title={isLast ? "Submit" : "Next"}
        onPress={isLast ? handleSubmit : animateNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "100%",
    marginBottom: 20,
    borderRadius: 4,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  genderBubble: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#aaa",
    backgroundColor: "#f0f0f0",
  },
  genderSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  genderText: {
    fontSize: 16,
    color: "#333",
  },
  genderTextSelected: {
    fontSize: 16,
    color: "#fff",
  },
});
