import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert, ActivityIndicator, TouchableOpacity, Image, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location"; // Import location module
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "./Context/userContext";
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
// import {BACKEND_URL} from "@env";
const CrimeSelection = () => {
  const [selectedCrime, setSelectedCrime] = useState("Hit and Run");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(AuthContext);

  // Get user's current location on component mount
  useEffect(() => {
    (async () => {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to send alerts.");
        setLoading(false);
        return;
      }

      // Request media library permissions
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaStatus !== "granted") {
        Alert.alert("Permission Denied", "Camera roll permissions are required to add photos/videos.");
      }

      // Request camera permissions
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== "granted") {
        Alert.alert("Permission Denied", "Camera permissions are required to take photos/videos.");
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7, // Compress image to reduce size
        base64: true, // Get base64 string
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
        setSelectedVideo(null); // Clear video if image is selected
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.5, // Compress video
        base64: false, // Videos are too large for base64
      });

      if (!result.canceled) {
        setSelectedVideo(result.assets[0]);
        setSelectedImage(null); // Clear image if video is selected
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick video.");
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
        setSelectedVideo(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo.");
    }
  };

  const takeVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.5,
        videoMaxDuration: 30, // Limit video to 30 seconds
      });

      if (!result.canceled) {
        setSelectedVideo(result.assets[0]);
        setSelectedImage(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to record video.");
    }
  };

  const removeMedia = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
  };

  const sendAlert = async () => {
    if (!location) {
      Alert.alert("Location Error", "Unable to fetch location. Try again.");
      return;
    }

    console.log("User object:", user);
    
    if (!user) {
      Alert.alert("Authentication Error", "Please log in to send alerts.");
      return;
    }

    const userId = user.id || user._id;
    if (!userId) {
      Alert.alert("Authentication Error", "User ID not found. Please log in again.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      
      // Add basic data
      formData.append('userId', userId);
      formData.append('policeStationId', '');
      formData.append('alertType', selectedCrime);
      formData.append('location', `Lat: ${location.latitude}, Lng: ${location.longitude}`);
      formData.append('description', additionalDetails || "A crime has been reported.");

      // Add image if selected
      if (selectedImage) {
        if (selectedImage.base64) {
          // Send as base64 string
          formData.append('image', `data:image/jpeg;base64,${selectedImage.base64}`);
        } else {
          // Send as file
          const uriParts = selectedImage.uri.split('.');
          const fileType = uriParts[uriParts.length - 1];
          
          formData.append('image', {
            uri: selectedImage.uri,
            name: `crime_image.${fileType}`,
            type: `image/${fileType}`,
          });
        }
      }

      // Add video if selected
      if (selectedVideo) {
        const uriParts = selectedVideo.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('video', {
          uri: selectedVideo.uri,
          name: `crime_video.${fileType}`,
          type: `video/${fileType}`,
        });
      }

      console.log("Sending FormData with:", {
        userId,
        alertType: selectedCrime,
        location: `Lat: ${location.latitude}, Lng: ${location.longitude}`,
        description: additionalDetails || "Not Available",
        hasImage: !!selectedImage,
        hasVideo: !!selectedVideo,
      });

      // Debug the actual FormData being sent
      logFormData(formData);

      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/emergency_alert`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let the browser set it automatically for FormData
      });

      const result = await response.json();
      
      if (response.ok) {
        Alert.alert("Alert Sent", "Your crime alert has been sent successfully!");
        
        // Reset all form fields
        resetForm();
      } else {
        Alert.alert("Error", result.message || "Failed to send alert.");
      }
    } catch (error) {
      console.error("Error sending alert:", error);
      Alert.alert("Error", "Something went wrong while sending alert.");
    } finally {
      setUploading(false);
    }
  };

  // Function to reset all form fields
  const resetForm = () => {
    setSelectedCrime("Hit and Run");
    setAdditionalDetails("");
    setSelectedImage(null);
    setSelectedVideo(null);
  };

  // Debug function to log FormData contents
  const logFormData = (formData) => {
    console.log("=== FormData Debug ===");
    for (let [key, value] of formData.entries()) {
      if (typeof value === 'object' && value.uri) {
        console.log(`${key}:`, {
          uri: value.uri,
          name: value.name,
          type: value.type,
        });
      } else {
        console.log(`${key}:`, value);
      }
    }
    console.log("=====================");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="warning" size={32} color="#FF3B30" />
          <Text style={styles.title}>Report a Crime</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>
            <MaterialIcons name="category" size={16} color="#666" /> Select Type of Crime
          </Text>
          <View style={styles.pickerContainer}>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            <Feather name="edit-3" size={16} color="#666" /> Additional Details
          </Text>
          <TextInput 
            placeholder="Describe what happened..." 
            style={styles.textInput} 
            value={additionalDetails} 
            onChangeText={setAdditionalDetails}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Media Upload Section */}
        <View style={styles.section}>
          <Text style={styles.label}>
            <Ionicons name="camera" size={16} color="#666" /> Add Photo or Video (Optional)
          </Text>
          
          <View style={styles.mediaGrid}>
            <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
              <Ionicons name="image" size={24} color="white" />
              <Text style={styles.buttonText}>Gallery Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mediaGrid}>
            <TouchableOpacity style={[styles.mediaButton, styles.videoButton]} onPress={pickVideo}>
              <Ionicons name="videocam" size={24} color="white" />
              <Text style={styles.buttonText}>Gallery Video</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.mediaButton, styles.videoButton]} onPress={takeVideo}>
              <MaterialIcons name="fiber-manual-record" size={24} color="white" />
              <Text style={styles.buttonText}>Record Video</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Media Preview */}
        {selectedImage && (
          <View style={styles.mediaPreview}>
            <View style={styles.previewHeader}>
              <Ionicons name="image" size={20} color="#007AFF" />
              <Text style={styles.previewLabel}>Selected Image</Text>
            </View>
            <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeButton} onPress={removeMedia}>
              <Ionicons name="trash" size={16} color="white" />
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedVideo && (
          <View style={styles.mediaPreview}>
            <View style={styles.previewHeader}>
              <Ionicons name="videocam" size={20} color="#007AFF" />
              <Text style={styles.previewLabel}>Selected Video</Text>
            </View>
            <View style={styles.videoPreviewContainer}>
              <Ionicons name="play-circle" size={48} color="#666" />
              <Text style={styles.videoInfo}>
                Duration: {Math.round(selectedVideo.duration / 1000)}s
              </Text>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={removeMedia}>
              <Ionicons name="trash" size={16} color="white" />
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Location Display */}
        <View style={styles.section}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
          ) : (
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={20} color="#007AFF" />
              <Text style={styles.locationText}>
                {location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : "Location not available"}
              </Text>
            </View>
          )}
        </View>

        {/* Send Button */}
        <TouchableOpacity 
          style={[styles.sendButton, (loading || uploading) && styles.disabledButton]} 
          onPress={sendAlert} 
          disabled={loading || uploading}
        >
          {uploading ? (
            <>
              <ActivityIndicator color="white" size="small" />
              <Text style={[styles.sendButtonText, { marginLeft: 8 }]}>Sending...</Text>
            </>
          ) : (
            <>
              <Ionicons name="send" size={20} color="white" />
              <Text style={[styles.sendButtonText, { marginLeft: 8 }]}>Send Alert</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Reset Button */}
        {/* <TouchableOpacity 
          style={styles.resetButton} 
          onPress={resetForm}
          disabled={uploading}
        >
          <Ionicons name="refresh" size={20} color="#6b7280" />
          <Text style={styles.resetButtonText}>Clear Form</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc'
  },
  content: {
    paddingTop:20,
    padding: 20,
    paddingBottom: 40,
    marginTop:40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 10,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerContainer: { 
    borderWidth: 1, 
    borderColor: "#e5e7eb", 
    borderRadius: 12, 
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textInput: { 
    borderWidth: 1, 
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    textAlignVertical: 'top',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  mediaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mediaButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    flex: 0.48,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  videoButton: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  mediaPreview: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  videoPreviewContainer: {
    height: 150,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  videoInfo: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  locationText: { 
    fontSize: 14, 
    color: "#6b7280",
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  resetButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9ca3af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  resetButtonText: {
    color: '#6b7280',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default CrimeSelection;
