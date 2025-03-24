import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location"; // Import location module
// import {BACKEND_URL} from "@env";
const CrimeSelection = () => {
  const [selectedCrime, setSelectedCrime] = useState("Hit and Run");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user's current location on component mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to send alerts.");
        setLoading(false);
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  const sendAlert = async () => {
    if (!location) {
      Alert.alert("Location Error", "Unable to fetch location. Try again.");
      return;
    }

    const requestData = {
      userId: "67dc1ab3547a040dcc9387e5",
      policeStationId: "",
      alertType: selectedCrime,
      location: `Lat: ${location.latitude}, Lng: ${location.longitude}`,
      description: additionalDetails || "A crime has been reported.",
      image: "",
      video: "",
    };

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/emergency_alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      Alert.alert("Alert Sent", "Your crime alert has been sent successfully!");
    } catch (error) {
      Alert.alert("Error", "Something went wrong while sending alert.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Select Type of Crime</Text>
      
        <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 5, width: "80%" }}>
            <Picker
                selectedValue={selectedCrime}
                onValueChange={(itemValue) => setSelectedCrime(itemValue)}
            >
                {[
                "Murder", "Hit and Run", "Sexual Harassment", "Stalking", "Kidnapping",
                "Rape", "Fight", "Theft", "Robbery", "Fraud", "Cybercrime", "Accident", "Other"
                ].map((crime, index) => (
                <Picker.Item key={index} label={crime} value={crime} />
                ))}
            </Picker>
        </View>

      <TextInput 
        placeholder="Add additional details" 
        style={styles.input} 
        value={additionalDetails} 
        onChangeText={setAdditionalDetails} 
      />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Text style={styles.locationText}>
          Location: {location ? `Lat: ${location.latitude}, Lng: ${location.longitude}` : "Not Available"}
        </Text>
      )}

      <Button title="Send" onPress={sendAlert} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  input: { borderWidth: 1, width: "80%", marginVertical: 10, padding: 8 },
  locationText: { marginTop: 10, fontSize: 14, color: "gray" },
});

export default CrimeSelection;
