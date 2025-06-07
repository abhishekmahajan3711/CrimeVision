import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import { AuthContext } from "./Context/userContext";

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBackground} />
        <Text style={styles.title}>My Profile</Text>
      </View>
      
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          {user ? (
            <>
              <View style={styles.nameSection}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoSection}>
                <View style={styles.infoItem}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>👤</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Full Name</Text>
                    <Text style={styles.infoValue}>{user.name}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>📧</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email Address</Text>
                    <Text style={styles.infoValue}>{user.email}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🆔</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Aadhar Number</Text>
                    <Text style={styles.infoValue}>{user.aadhar}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>📞</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Phone Number</Text>
                    <Text style={styles.infoValue}>{user.phone}</Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.loading}>Loading user data...</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 120,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#4f46e5',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginTop: 20,
  },
  profileContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4f46e5',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 30,
    overflow: 'hidden',
  },
  nameSection: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  infoSection: {
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loading: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default ProfileScreen;
