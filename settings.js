import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FinanceTrackerSettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const toggleNotifications = () =>
    setNotificationsEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.userName}>Sanjay</Text>
            <Text style={styles.viewActivity}>Account overview</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="wallet-outline" size={24} color="#000" />
        <Text style={styles.menuText}>Account Details</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="card-outline" size={24} color="#000" />
        <Text style={styles.menuText}>Subscription Plans</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="key-outline" size={24} color="#000" />
        <Text style={styles.menuText}>Privacy Settings</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#000" />
      </TouchableOpacity>

      <View style={styles.menuItem}>
        <Ionicons name="notifications-outline" size={24} color="#000" />
        <Text style={styles.menuText}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: "#767577", true: "#007bff" }}
          thumbColor={notificationsEnabled ? "#007bff" : "#f4f3f4"}
        />
      </View>

      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="shield-checkmark-outline" size={24} color="#000" />
        <Text style={styles.menuText}>Security</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#000" />
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>Support</Text>

      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="help-circle-outline" size={24} color="#000" />
        <Text style={styles.menuText}>Help & Support</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="document-text-outline" size={24} color="#000" />
        <Text style={styles.menuText}>Terms & Conditions</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          navigation.navigate("Welcome");
        }}
      >
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  viewActivity: {
    color: "#000",
    marginTop: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: "space-between",
  },
  menuText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
    marginLeft: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    color: "#000",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default FinanceTrackerSettingsScreen;
