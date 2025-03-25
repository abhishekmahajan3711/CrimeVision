import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const CrimeDashboard = () => {
  // State for selected crime category
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Crime category options
  const crimeCategories = [
    "All", "Murder", "Hit and Run", "Sexual Harassment", "Stalking", "Kidnapping",
    "Rape", "Fight", "Theft", "Robbery", "Fraud", "Cybercrime", "Accident", "Other"
  ];

  // Dummy data for cases
  const crimeData = {
    "All": { total: 20, solved: 18, pending: 2 },
    "Murder": { total: 5, solved: 3, pending: 2 },
    "Theft": { total: 8, solved: 6, pending: 2 },
    "Cybercrime": { total: 4, solved: 3, pending: 1 },
    "Accident": { total: 3, solved: 2, pending: 1 },
    "Other": { total: 6, solved: 5, pending: 1 },
  };

  // Get data for selected category
  const { total, solved, pending } = crimeData[selectedCategory] || { total: 0, solved: 0, pending: 0 };

  // Maximum height for the bars
  const maxHeight = 150;

  return (
    <View style={styles.container}>
      {/* Police Station Details */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>District: Pune</Text>
        <Text style={styles.infoText}>Area: Nigdi Pradhikaran</Text>
        <Text style={styles.infoText}>Police Station: Nigdi Pradhikaran Police Station</Text>
      </View>

      {/* Dropdown for Crime Categories */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Crime Type:</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          {crimeCategories.map((crime, index) => (
            <Picker.Item key={index} label={crime} value={crime} />
          ))}
        </Picker>
      </View>

      {/* Bar Chart (Custom Implementation) */}
      <View style={styles.chartContainer}>
        {/* Total Cases Bar */}
        <View style={styles.barWrapper}>
          <View style={[styles.bar, { height: (total / 20) * maxHeight, backgroundColor: "#007bff" }]} />
          <Text style={styles.barLabel}>{total}</Text>
          <Text style={styles.barText}>Total</Text>
        </View>

        {/* Solved Cases Bar */}
        <View style={styles.barWrapper}>
          <View style={[styles.bar, { height: (solved / 20) * maxHeight, backgroundColor: "#28a745" }]} />
          <Text style={styles.barLabel}>{solved}</Text>
          <Text style={styles.barText}>Solved</Text>
        </View>

        {/* Pending Cases Bar */}
        <View style={styles.barWrapper}>
          <View style={[styles.bar, { height: (pending / 20) * maxHeight, backgroundColor: "#dc3545" }]} />
          <Text style={styles.barLabel}>{pending}</Text>
          <Text style={styles.barText}>Pending</Text>
        </View>
      </View>

      {/* Crime Rate Change Info */}
      <Text style={styles.rateText}>Crime Rate Compared to last month: 10% Up</Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  infoContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#e3f2fd",
    borderRadius: 5,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 200,
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  barWrapper: {
    alignItems: "center",
  },
  bar: {
    width: 40,
    borderRadius: 5,
  },
  barLabel: {
    position: "absolute",
    top: -20,
    fontSize: 16,
    fontWeight: "bold",
  },
  barText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  rateText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "red",
  },
});

export default CrimeDashboard;
