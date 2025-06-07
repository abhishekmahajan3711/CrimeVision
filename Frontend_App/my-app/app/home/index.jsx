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

      {/* Feature Slider */}
      <View style={styles.sliderContainer}>
        <PagerView style={styles.slider} initialPage={0}>
          <View style={styles.page} key="1">
            <View style={styles.pageContent}>
              <MaterialIcons name="report" size={50} color="#FF6B6B" />
              <Text style={styles.pageTitle}>Report Crime Instantly</Text>
              <Text style={styles.pageDescription}>
                Quickly report crimes with photo and video evidence. 
                Your reports help build a safer community by providing 
                real-time crime data to authorities.
              </Text>
            </View>
          </View>
          <View style={styles.page} key="2">
            <View style={styles.pageContent}>
              <MaterialIcons name="analytics" size={50} color="#4ECDC4" />
              <Text style={styles.pageTitle}>Police Station Analytics</Text>
              <Text style={styles.pageDescription}>
                View comprehensive crime statistics organized by police stations. 
                Track crime trends, patterns, and get insights into your area's 
                safety profile with detailed data visualization.
              </Text>
            </View>
          </View>
          <View style={styles.page} key="3">
            <View style={styles.pageContent}>
              <MaterialCommunityIcons name="shield-check" size={50} color="#45B7D1" />
              <Text style={styles.pageTitle}>Building Safer Society</Text>
              <Text style={styles.pageDescription}>
                Together we create a transparent, data-driven approach to 
                community safety. Your participation helps law enforcement 
                respond faster and makes neighborhoods safer.
              </Text>
            </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 10 
  },
  profileCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  profileText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'black' 
  },
  welcomeText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 20 
  },
  alertButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#e74c3c', 
    padding: 15, 
    borderRadius: 10, 
    justifyContent: 'center',
    marginBottom: 20,
  },
  alertText: {
    fontSize: 16, 
    fontWeight: 'bold',
    color: 'white'
  },
  grid: { 
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 20,
  },
  gridItem: { 
    width: '30%', 
    paddingVertical: 20, 
    backgroundColor: '#e3f2fd', 
    marginBottom: 15, 
    alignItems: 'center', 
    borderRadius: 8 
  },
  gridText: { 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  sliderContainer: {
    height: 250,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  slider: {
    height: 220,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  pageContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    width: '95%',
    height: '90%',
    marginHorizontal: 10,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  pageDescription: {
    fontSize: 14,
    color: '#5a6c7d',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  swipeText: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default Home;
