import React, { useState, useEffect, useContext } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Image,
  Dimensions
} from "react-native";
import { Video } from 'expo-av';
import { SafeAreaView } from "react-native-safe-area-context";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from './Context/userContext';

const NotificationScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchUserAlerts();
  }, []);

  const fetchUserAlerts = async () => {
    try {
      setLoading(true);
      const userId = user?.id || user?._id;
      
      if (!userId) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/user/${userId}/alerts`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      const data = await response.json();
      setAlerts(data.alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      Alert.alert("Error", "Failed to fetch your alerts");
    } finally {
      setLoading(false);
    }
  };

  const fetchAlertDetails = async (alertId) => {
    try {
      setDetailsLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/alert/${alertId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch alert details');
      }

      const data = await response.json();
      setSelectedAlert(data.alert);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching alert details:', error);
      Alert.alert("Error", "Failed to fetch alert details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#FF9800';
      case 'resolved': return '#4CAF50';
      case 'investigating': return '#2196F3';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'hourglass-empty';
      case 'resolved': return 'check-circle';
      case 'investigating': return 'search';
      default: return 'help-outline';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  const renderAlertItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.alertCard}
      onPress={() => fetchAlertDetails(item._id)}
    >
      {/* Top Section - Status and Date */}
      <View style={styles.alertTopSection}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.Status) }]}>
          <Text style={styles.statusText}>{item.Status}</Text>
        </View>
        <Text style={styles.alertDate}>
          {formatDate(item.createdAt)}
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.alertMainContent}>
        <View style={styles.alertTitleRow}>
          <Text style={styles.alertTypeTitle}>{item.AlertType}</Text>
          <View style={styles.priorityBadge}>
            <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(item.Priority) }]} />
            <Text style={styles.priorityLabel}>{item.Priority}</Text>
          </View>
        </View>
        
        <Text style={styles.alertDescription} numberOfLines={2}>
          {item.Description}
        </Text>
      </View>

      {/* Bottom Section - Station Info */}
      <View style={styles.alertBottomSection}>
        <Text style={styles.stationText}>
          📍 {item.PoliceStationID?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderAlertDetails = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
              <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Alert Details</Text>
          </View>

        {detailsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Loading details...</Text>
          </View>
        ) : selectedAlert ? (
          <ScrollView style={styles.detailsContent}>
                         <View style={styles.detailCard}>
               <View style={styles.detailHeader}>
                 {/* <Text style={styles.detailEmoji}>🚨</Text> */}
                 <View style={styles.detailHeaderText}>
                   <Text style={styles.detailTitle}>{selectedAlert.AlertType}</Text>
                   <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedAlert.Status) }]}>
                     <Text style={styles.statusText}>{selectedAlert.Status}</Text>
                   </View>
                 </View>
               </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.sectionContent}>{selectedAlert.Description}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Location</Text>
                <Text style={styles.sectionContent}>{selectedAlert.Location}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Police Station</Text>
                <Text style={styles.sectionContent}>
                  {selectedAlert.PoliceStationID?.name}, {selectedAlert.PoliceStationID?.district}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailHalf}>
                  <Text style={styles.sectionTitle}>Priority</Text>
                  <View style={styles.priorityContainer}>
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(selectedAlert.Priority) }]} />
                    <Text style={styles.priorityText}>{selectedAlert.Priority}</Text>
                  </View>
                </View>
                <View style={styles.detailHalf}>
                  <Text style={styles.sectionTitle}>Date & Time</Text>
                  <Text style={styles.sectionContent}>
                    {formatDate(selectedAlert.createdAt)}
                  </Text>
                </View>
              </View>

                             {/* Evidence Section */}
               {(selectedAlert.Image || selectedAlert.Video) && (
                 <View style={styles.detailSection}>
                   <Text style={styles.sectionTitle}>Evidence</Text>
                   {console.log('Alert data:', selectedAlert)}
                   {selectedAlert.Image && (
                     <View style={styles.evidenceContainer}>
                       <Text style={styles.evidenceLabel}>📷 Image Evidence:</Text>
                       <Image 
                         source={{ 
                           uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/uploads/images/${selectedAlert.Image.filename}` 
                         }}
                         style={styles.evidenceImage}
                         resizeMode="contain"
                         onError={(error) => {
                           console.log('Image load error:', error);
                           console.log('Image URL:', `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/uploads/images/${selectedAlert.Image.filename}`);
                         }}
                         onLoad={() => {
                           console.log('Image loaded successfully');
                           console.log('Image URL:', `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/uploads/images/${selectedAlert.Image.filename}`);
                         }}
                       />
                       <Text style={styles.fileInfo}>
                         Size: {(selectedAlert.Image.size / 1024 / 1024).toFixed(2)} MB
                       </Text>
                     </View>
                   )}
                   {selectedAlert.Video && (
                     <View style={styles.evidenceContainer}>
                       <Text style={styles.evidenceLabel}>🎬 Video Evidence:</Text>
                       <Video
                         source={{ 
                           uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/uploads/videos/${selectedAlert.Video.filename}` 
                         }}
                         style={styles.evidenceVideo}
                         useNativeControls
                         resizeMode="contain"
                         shouldPlay={false}
                         onError={(error) => {
                           console.log('Video load error:', error);
                           console.log('Video URL:', `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/uploads/videos/${selectedAlert.Video.filename}`);
                         }}
                         onLoad={() => {
                           console.log('Video loaded successfully');
                           console.log('Video URL:', `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/uploads/videos/${selectedAlert.Video.filename}`);
                         }}
                       />
                       <Text style={styles.fileInfo}>
                         Size: {(selectedAlert.Video.size / 1024 / 1024).toFixed(2)} MB
                       </Text>
                     </View>
                   )}
                 </View>
               )}

               {/* Action Report Section (if available) */}
               {selectedAlert.ActionReport && selectedAlert.ActionReport.trim() !== "" && (
                 <View style={styles.detailSection}>
                   <Text style={styles.sectionTitle}>Action Report</Text>
                   <View style={styles.actionReportContainer}>
                     <Text style={styles.actionReportText}>{selectedAlert.ActionReport}</Text>
                   </View>
                 </View>
               )}

               {/* Timeline Section */}
               <View style={styles.detailSection}>
                 <Text style={styles.sectionTitle}>Timeline</Text>
                 <View style={styles.timelineContainer}>
                   {/* Alert Creation */}
                   <View style={styles.timelineItem}>
                     <View style={[styles.timelineDot, { backgroundColor: '#28a745' }]} />
                     <View style={styles.timelineContent}>
                       <Text style={styles.timelineAction}>Alert Created</Text>
                       <Text style={styles.timelineDate}>{formatDate(selectedAlert.createdAt)}</Text>
                       <Text style={styles.timelineDescription}>Initial report submitted</Text>
                     </View>
                   </View>

                   {/* Activity Log Timeline */}
                   {selectedAlert.ActivityLog && selectedAlert.ActivityLog.length > 0 && 
                     selectedAlert.ActivityLog.map((activity, index) => (
                       <View key={index} style={styles.timelineItem}>
                         <View style={[styles.timelineDot, { backgroundColor: '#2196F3' }]} />
                         <View style={styles.timelineContent}>
                           <Text style={styles.timelineAction}>{activity.action}</Text>
                           <Text style={styles.timelineDate}>{formatDate(activity.performedAt)}</Text>
                         </View>
                       </View>
                     ))
                   }

                   {/* Current Status (if different from creation) */}
                   {selectedAlert.updatedAt && selectedAlert.updatedAt !== selectedAlert.createdAt && (
                     <View style={styles.timelineItem}>
                       <View style={[styles.timelineDot, { backgroundColor: getStatusColor(selectedAlert.Status) }]} />
                       <View style={styles.timelineContent}>
                         <Text style={styles.timelineAction}>Status: {selectedAlert.Status}</Text>
                         <Text style={styles.timelineDate}>{formatDate(selectedAlert.updatedAt)}</Text>
                       </View>
                     </View>
                   )}
                 </View>
               </View>

               {/* Comments Section */}
               <View style={styles.detailSection}>
                 <Text style={styles.sectionTitle}>Comments & Updates</Text>
                 {selectedAlert.Comments && selectedAlert.Comments.length > 0 ? (
                   <View style={styles.commentsContainer}>
                     {selectedAlert.Comments.map((comment, index) => (
                       <View key={index} style={styles.commentItem}>
                         <View style={styles.commentHeader}>
                           <Text style={styles.commentAuthor}>
                             💬 Comment
                           </Text>
                           <Text style={styles.commentDate}>{formatDate(comment.addedAt)}</Text>
                         </View>
                         <Text style={styles.commentText}>{comment.text}</Text>
                       </View>
                     ))}
                   </View>
                 ) : (
                   <View style={styles.noCommentsContainer}>
                     <Text style={styles.noCommentsText}>💬 No comments yet</Text>
                     <Text style={styles.noCommentsSubtext}>Updates and comments will appear here</Text>
                   </View>
                 )}
               </View>
            </View>
          </ScrollView>
        ) : null}
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading your alerts...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {alerts.length === 0 ? (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>My Alerts</Text>
              <Text style={styles.headerSubtitle}>
                {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Alerts Yet</Text>
            <Text style={styles.emptyMessage}>
              Your submitted alerts will appear here
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={alerts}
          renderItem={renderAlertItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchUserAlerts}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>My Alerts</Text>
                <Text style={styles.headerSubtitle}>
                  {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderAlertDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 0,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
    marginHorizontal:0,
    width: '100%',
    backgroundColor: '#5d5cbf',
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  listContainer: {
    paddingTop: 0,
    paddingBottom: 20,
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 0,
    marginBottom: 12,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  alertTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  alertDate: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  alertMainContent: {
    padding: 16,
    paddingBottom: 12,
  },
  alertTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTypeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    flex: 1,
    marginRight: 12,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  priorityIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  priorityLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#495057',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  alertDescription: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 0,
  },
  alertBottomSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
  },
  stationText: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#5d5cbf',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  detailsContent: {
    flex: 1,
    padding: 20,
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  detailEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  detailHeaderText: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  detailHalf: {
    flex: 1,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  evidenceContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  evidenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  evidenceImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  evidenceVideo: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  fileInfo: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Action Report Styles
  actionReportContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    marginTop: 10,
  },
  actionReportText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    fontStyle: 'italic',
  },

  // Timeline Styles
  timelineContainer: {
    marginTop: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 15,
  },
  timelineContent: {
    flex: 1,
  },
  timelineAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },

  // Comments Styles
  commentsContainer: {
    marginTop: 10,
  },
  commentItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noCommentsContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginTop: 10,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  noCommentsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default NotificationScreen;
