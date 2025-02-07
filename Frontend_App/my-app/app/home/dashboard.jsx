import { View, Text, StyleSheet,FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
const policeStations = [
  { id: "1", name: "Station A" },
  { id: "2", name: "Station B" },
  { id: "3", name: "Station C" },
  { id: "4", name: "Station D" },
  { id: "5", name: "Station E" },
  { id: "6", name: "Station F" },
];
const DataVisualization = () => {
  const router = useRouter();
  const [selectedSortValue, setSelectedSortValue] = useState("Total");
  const [selectedOrderValue, setSelectedOrderValue] = useState("High to Low");

  return (
    <View style={styles.container}>
      {/* Sort By Section */}
      <View style={styles.dropdownWrapper}>
        <Text style={styles.label}>Sort By:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedSortValue}
            onValueChange={(itemValue) => setSelectedSortValue(itemValue)}
            style={styles.picker}
          >
            {["Total", "Solved", "Pending"].map((sortval, index) => (
              <Picker.Item key={index} label={sortval} value={sortval} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Order By Section */}
      <View style={styles.dropdownWrapper}>
        <Text style={styles.label}>Order By:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedOrderValue}
            onValueChange={(itemValue) => setSelectedOrderValue(itemValue)}
            style={styles.picker}
          >
            {["High to Low", "Low to High"].map((orderval, index) => (
              <Picker.Item key={index} label={orderval} value={orderval} />
            ))}
          </Picker>
        </View>
      </View>

      <View>
        <Text style={styles.listHeader}>Police Station List</Text>
        <FlatList
          data={policeStations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>router.push("/home/dataVisualization")}>
              <View style={styles.listItem}>
              <Text style={styles.listText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
            
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  dropdownWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
    color: "#333",
  },
  listHeader: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
  },
  listItem: {
    padding: 15,
    borderWidth:1,
    borderRadius:5,
    borderColor: "#ccc",
    margin:5,
    backgroundColor: "#f9f9f9",
  },
  listText: {
    fontSize: 14,
    color: "#333",
  },
});
export default DataVisualization;