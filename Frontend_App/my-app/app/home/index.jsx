import React, { useState } from "react";
import { View, Text, Button,StyleSheet,TouchableOpacity } from "react-native";
import AlertConfirmation from "../../components/AlertConfirmation"; 

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* <Button title="Send Alert" onPress={() => setShowModal(true)} /> */}

      {/* Emergency Alert Button */}
      <TouchableOpacity style={styles.alertButton} onPress={() => setShowModal(true)}>
  
        <Text style={styles.alertText}> Send Emergency Alert</Text>
      </TouchableOpacity>

      <AlertConfirmation visible={showModal} onClose={() => setShowModal(false)} />
      {/* Grid Menu */}
      <View style={styles.grid}>
        {['Profile', 'Dashboard', 'Notification', 'Settings', 'About Us', 'Log Out'].map((item, index) => (
          <TouchableOpacity key={index} style={styles.gridItem} onPress={() => router.push(`/${item.toLowerCase()}`)}>
            <Text style={styles.gridText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#007AFF', padding: 15, borderRadius: 10 },
  profileCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  profileText: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  welcomeText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  alertButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'red', padding: 15, borderRadius: 10, justifyContent: 'center' },
  alertText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  gridItem: { width: '30%', padding: 20, backgroundColor: '#ddd', marginBottom: 15, alignItems: 'center', borderRadius: 8 },
  gridText: { fontSize: 16, fontWeight: 'bold' },
});

export default Home;
