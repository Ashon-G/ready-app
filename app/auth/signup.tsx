// top of Signup.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const steps = [
  "Username",
  "Email",
  "Gender",
  "Address",
  "Phone",
  "Birthday",
  "Password",
];

export default function Signup() {
  const [step, setStep] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [dobError, setDobError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();

  const animateTo = (index: number) => {
    Animated.timing(translateX, {
      toValue: -index * width,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setStep(index);
  };

  const next = async () => {
    setUsernameError("");
    setEmailError("");
    setGenderError("");
    setAddressError("");
    setPhoneError("");
    setDobError("");
    setPasswordError("");

    if (step === 0) {
      if (!username) {
        setUsernameError("Username is required");
        return;
      }
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setUsernameError("Username already taken");
        return;
      }
    }

    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Enter a valid email");
        return;
      }
    }

    if (step === 2) {
      if (!gender) {
        setGenderError("Please select your gender");
        return;
      }
    }

    if (step === 3) {
      if (!street || !city || !zip) {
        setAddressError("Complete address is required");
        return;
      }
    }

    if (step === 4) {
      if (!phone) {
        setPhoneError("Enter a valid phone number");
        return;
      }
    }

    if (step === 5) {
      if (!dob) {
        setDobError("Select your date of birth");
        return;
      }
    }

    if (step === 6) {
      if (!password || password !== confirm) {
        setPasswordError("Passwords do not match");
        return;
      }
    }

    if (step < steps.length - 1) {
      animateTo(step + 1);
    } else {
      handleSubmit();
    }
  };

  const prev = () => {
    if (step > 0) {
      animateTo(step - 1);
    }
  };

  const handleSubmit = async () => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      username,
      email,
      gender,
      street,
      city,
      zip,
      country: "US",
      phone,
      dob: dob ? dob.toISOString() : null,
    });
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.slider,
          { width: width * steps.length, transform: [{ translateX }] },
        ]}
      >
        <View style={styles.step}>
          <Text style={styles.title}>What should we call you?</Text>
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          {usernameError ? (
            <Text style={styles.error}>{usernameError}</Text>
          ) : null}
        </View>
        <View style={styles.step}>
          <Text style={styles.title}>What's your email address?</Text>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
        </View>
        <View style={styles.step}>
          <Text style={styles.title}>What's your gender?</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === "Male" && styles.genderSelected,
              ]}
              onPress={() => setGender("Male")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "Male" && styles.genderTextSelected,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === "Female" && styles.genderSelected,
              ]}
              onPress={() => setGender("Female")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "Female" && styles.genderTextSelected,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
          {genderError ? <Text style={styles.error}>{genderError}</Text> : null}
        </View>
        <View style={styles.step}>
          <Text style={styles.title}>Address</Text>
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
            keyboardType="numeric"
          />
          {addressError ? (
            <Text style={styles.error}>{addressError}</Text>
          ) : null}
        </View>
        <View style={styles.step}>
          <Text style={styles.title}>Enter your phone number</Text>
          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}
        </View>
        <View style={styles.step}>
          <Text style={styles.title}>When's your birthday?</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text>{dob ? dob.toLocaleDateString() : "Select date"}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob || new Date()}
              mode="date"
              display="spinner"
              onChange={(e, selected) => {
                setShowDatePicker(false);
                if (selected) setDob(selected);
              }}
            />
          )}
          {dobError ? <Text style={styles.error}>{dobError}</Text> : null}
        </View>
        <View style={styles.step}>
          <Text style={styles.title}>Create password</Text>
          <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm password"
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}
        </View>
      </Animated.View>
      <View style={styles.buttonRow}>
        {step > 0 && (
          <TouchableOpacity style={styles.navButton} onPress={prev}>
            <Text style={styles.navButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.navButton} onPress={next}>
          <Text style={styles.navButtonText}>
            {step === steps.length - 1 ? "Submit" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fbfa",
    paddingTop: 60,
  },
  slider: {
    flexDirection: "row",
    flex: 1,
  },
  step: {
    width,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0e1a13",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1e6d9",
    backgroundColor: "#e8f2ec",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: "#0e1a13",
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  genderOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1e6d9",
    borderRadius: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  genderSelected: {
    backgroundColor: "#39e079",
    borderColor: "#39e079",
  },
  genderText: {
    color: "#0e1a13",
  },
  genderTextSelected: {
    color: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 8,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  navButton: {
    backgroundColor: "#39e079",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  navButtonText: {
    color: "#0e1a13",
    fontWeight: "bold",
  },
});
