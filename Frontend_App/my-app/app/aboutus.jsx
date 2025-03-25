import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const AboutUsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>


      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Members</Text>
        <View style={styles.row}>
          <Text style={styles.info}>Gaurav Katkade</Text>
          <Text style={styles.seatNumber}>BECO2425B022</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.info}>Monika Thube</Text>
          <Text style={styles.seatNumber}>BEC02425B027</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.info}>Abhishek Mahajan</Text>
          <Text style={styles.seatNumber}>BEC02425B040</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.info}>Smita Bandi</Text>
          <Text style={styles.seatNumber}>BECO2425B051</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Under The Guidance of</Text>
        <Text style={styles.info}>Mrs. Deepali Gohil</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Department</Text>
        <Text style={styles.info}>Computer Engineering</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>College</Text>
        <Text style={styles.info}>D. Y. Patil College of Engineering, Akurdi, Pune-44</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  info: {
    fontSize: 18,
    color: "#444",
    flex: 1,
  },
  seatNumber: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
  },
});

export default AboutUsScreen;
