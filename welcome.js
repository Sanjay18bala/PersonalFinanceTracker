import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import axios from "axios";

export default function App({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

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

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setError("");
    try {
      axios
        .post("http://192.168.9.61:3000/getUserDetails", {
          EMAIL: email,
        })
        .then((res) => {
          const { EMAIL, PASSWORD } = res.data;

          if (EMAIL === email && PASSWORD === password) {
            navigation.navigate("Home");
          } else if (EMAIL === email && PASSWORD !== password) {
            setError("Invalid username or password");
          } else {
            setError("Invalid username or password");
          }
        });
    } catch (error) {
      console.log(error);
    }
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
            <Text style={styles.subtitle}>
              A platform built for a new way of tracking finances
            </Text>

            <View
              style={[
                styles.iconContainer,
                {
                  transform: [
                    { scale: showSignUp ? 0.8 : 1 },
                    { translateY: showSignUp ? -20 : 0 },
                  ],
                },
              ]}
            >
              <Image
                source={require("../assets/images/Money.png")}
                style={styles.image}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Email"
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
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setKeyboardOpen(true)}
              onBlur={() => setKeyboardOpen(false)}
            />

            {showSignUp && (
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#aaa"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                onFocus={() => setKeyboardOpen(true)}
                onBlur={() => setKeyboardOpen(false)}
              />
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login");
              }}
              style={styles.signUpContainer}
            >
              <Text
                style={[
                  styles.signUpText,
                  { textAlign: "left", alignSelf: "flex-start" },
                ]}
              >
                Don't have an account? Sign up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign In</Text>
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
  iconContainer: {
    padding: 40,
  },
  title: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 10,
    width: "100%",
    textAlign: "center",
    backgroundColor: "#000",
    padding: 10,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 15,
    justifyContent: "center",
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
    justifyContent: "center",
  },
  image: {
    height: 250,
    width: 250,
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
  signUpText: {
    color: "#007bff",
    fontSize: 16,
    marginBottom: 20,
    alignSelf: "flex-start",
    paddingLeft: 10,
  },
  signUpContainer: {
    width: "100%",
  },
});
