import React, { useContext, useState } from "react";
import { View, Text, Button,StyleSheet,TouchableOpacity } from "react-native";
import AlertConfirmation from "../../components/AlertConfirmation"; 
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from "expo-router";
import { AuthContext } from "../Context/userContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PagerView from 'react-native-pager-view';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const {user,setUser} = useContext(AuthContext);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken"); // Remove token from storage
      setUser(null); // Clear user state
      router.replace("/"); // Redirect to sign-in page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <View style={styles.container}>
      {/* <Button title="Send Alert" onPress={() => setShowModal(true)} /> */}

      {/* Emergency Alert Button */}
      <TouchableOpacity style={styles.alertButton} onPress={() => setShowModal(true)}>
  
        <Text style={styles.alertText}> ⚠️ Send Emergency Alert </Text>
      </TouchableOpacity>

      <AlertConfirmation visible={showModal} onClose={() => setShowModal(false)} />
      {/* Grid Menu */}
      <View style={styles.grid}>
        
        <TouchableOpacity style={styles.gridItem} onPress={()=>router.push("/profile")}>
          <Ionicons name="person" size={24} color="black" />
          <Text style={styles.gridText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={()=>router.push("/dashboard")}>
          <MaterialIcons name="dashboard" size={24} color="black" />
          <Text style={styles.gridText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={()=>router.push("/notifications")}>
          <Ionicons name="notifications" size={24} color="black" />
          <Text style={styles.gridText}>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={()=>router.push("/settings")}>
          <Ionicons name="settings" size={24} color="black" />
          <Text style={styles.gridText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={()=>router.push("/aboutus")}>
          <Ionicons name="information" size={24} color="black" />
          <Text style={styles.gridText}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={()=>{handleLogout()}}>
          <MaterialCommunityIcons name="logout" size={24} color="black" />
          <Text style={styles.gridText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
      <PagerView style={styles.container} initialPage={0}>
        <View style={styles.page} key="1">
          <Text>First page</Text>
          <Text>Swipe ➡️</Text>
        </View>
        <View style={styles.page} key="2">
          <Text>Second page</Text>
        </View>
        <View style={styles.page} key="3">
          <Text>Third page</Text>
        </View>
      </PagerView>
    </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
     flex: 1,
      backgroundColor: 'white', 
      padding: 20,
      margin:3,
      paddingTop:100,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 10 
  },
  profileCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  profileText: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  welcomeText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  alertButton: {
     flexDirection: 'row', 
     alignItems: 'center', 
     backgroundColor: 'red', 
     padding: 15, borderRadius: 10, 
     justifyContent: 'center',
     borderWidth:1,
     borderColor:'red'
  },
  alertText: {
    fontSize: 16, 
    fontWeight: 'bold',
    color:'white'
  },
  grid: { 
      flexDirection: 'row',
      flexWrap: 'wrap', 
      justifyContent: 'space-between', 
      marginTop: 20 
  },
  gridItem: { width: '30%', paddingVertical: 20, backgroundColor: '#e3f2fd', marginBottom: 15, alignItems: 'center', borderRadius: 8 },
  gridText: { fontSize: 14, fontWeight: 'bold' },
});

export default Home;
