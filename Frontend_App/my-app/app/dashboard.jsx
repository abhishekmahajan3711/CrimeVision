import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

const districtsData = {
  "Pune": [
    "Faraskhana Police Station",
    "Khadki Police Station",
    "Swargate Police Station",
    "Vishrambaug Police Station",
    "Shivaji Nagar Police Station",
    "Deccan Police Station",
    "Bharti Vidyapeeth Police Station",
    "Sahakar Nagar Police Station",
    "Katraj Police Station",
    "Bharati Police Station",
    "Kondhwa Police Station",
    "Koregaon Park Police Station",
    "Mundhwa Police Station",
    "Airport Police Station",
    "Hadapsar Police Station",
    "Chandan Nagar Police Station",
    "Ramwadi Police Station",
    "Yerwada Police Station",
    "Vimantal Police Station",
    "Warje Police Station",
    "Dattawadi Police Station",
    "Market Yard Police Station",
    "Chaturshrungi Police Station",
    "Dighi Police Station",
    "Bhosari Police Station",
    "Nigdi Police Station",
  ],
  "Mumbai": ["Andheri", "Bandra", "Dadar"],
  "Nagpur": ["Sitabuldi", "Sadar", "Mankapur"],
};

const Dashboard = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("Pune");
  const router = useRouter();

  return (
    <View style={styles.container}>
  
      <Text style={styles.label}>Select District:</Text>
      <Picker
        selectedValue={selectedDistrict}
        onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
        style={styles.picker}
      >
        {Object.keys(districtsData).map((district) => (
          <Picker.Item key={district} label={district} value={district} />
        ))}
      </Picker>
      <Text style={styles.label}>Police Stations:</Text>
      <ScrollView style={styles.scrollView}>
        {districtsData[selectedDistrict].map((station, index) => (
          <TouchableOpacity
            key={index}
            style={styles.stationButton}
            onPress={() => router.push(`/dataAnalytics?station=${station}&district=${selectedDistrict}`)}
          >
            <Text style={styles.stationText}>{station}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  picker: { height: 50, backgroundColor: "#f0f0f0", borderRadius: 8 },
  scrollView: { marginTop: 10 },
  stationButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  stationText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default Dashboard;
