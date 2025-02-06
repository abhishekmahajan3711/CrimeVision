import React from "react";
import { View, Text, Button, Modal, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const AlertConfirmation = ({ visible, onClose }) => {
  const router = useRouter();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text>Do you want to confirm proceed?</Text>
          <View style={styles.buttonContainer}>
            <Button title="YES" onPress={() => { 
              onClose();  
              router.push("/crimeSelection");  // Navigate to crime selection
            }} />
            <Button title="NO" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  buttonContainer: { flexDirection: "row", marginTop: 10, gap: 10 },
});

export default AlertConfirmation;
