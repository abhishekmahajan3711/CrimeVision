import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { AuthContext } from "./Context/userContext";

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.card}>
        {user ? (
          <>
            
            <Text style={styles.info}>👤 <Text style={styles.bold}>Name:</Text> {user.name}</Text>
            <Text style={styles.info}>📧 <Text style={styles.bold}>Email:</Text> {user.email}</Text>
            <Text style={styles.info}>🆔 <Text style={styles.bold}>Aadhar:</Text> {user.aadhar}</Text>
            <Text style={styles.info}>📞 <Text style={styles.bold}>Phone:</Text> {user.phone}</Text>
          </>
        ) : (
          <Text style={styles.loading}>Loading user data...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6, // For Android shadow
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 2,
  },
  info: {
    fontSize: 18,
    color: "#555",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
    color: "#333",
  },
  loading: {
    fontSize: 16,
    color: "gray",
  },
});

export default ProfileScreen;
