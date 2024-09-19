import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleRegister = async () => {
    if (!email || !password || !phoneNumber) {
      setError("Please enter email, password and phone number");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }
    setError("");
    try {
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d{10}$/;
    return re.test(phoneNumber);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Finance Tracker</Text>
            <Text style={styles.platformTitle}>
              A platform built for a new way of tracking finances
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 20,
              }}
            >
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setKeyboardOpen(true)}
              onBlur={() => setKeyboardOpen(false)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setKeyboardOpen(true)}
              onBlur={() => setKeyboardOpen(false)}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="#aaa"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              onFocus={() => setKeyboardOpen(true)}
              onBlur={() => setKeyboardOpen(false)}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => {
                navigation.navigate("Welcome");
              }}
            >
              <Text style={styles.signupButtonText}>
                Already have an account? Sign in
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleRegister}
            >
              <Text style={styles.loginButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
    width: "100%",
    textAlign: "center",
    backgroundColor: "#000",
    padding: 10,
    paddingTop: 60,
  },
  platformTitle: {
    fontSize: 18,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    alignSelf: "flex-start",
    paddingLeft: 10,
  },
  loginButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    justifyContent: "center",
    borderRadius: 8,
    width: "100%",
    marginTop: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    justifyContent: "center",
    paddingLeft: 10,
  },
  signupButton: {
    justifyContent: "center",
    borderRadius: 8,
    width: "100%",
    marginTop: 20,
    paddingLeft: 10,
  },
  signupButtonText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "600",
    justifyContent: "center",
  },
  socialButton: {
    backgroundColor: "#1a1a1a",
    padding: 10,
    justifyContent: "center",
    borderRadius: 8,
    width: "28%",
    marginRight: 10,
    alignItems: "center",
  },
  socialButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    justifyContent: "center",
    textAlign: "center",
  },
});
