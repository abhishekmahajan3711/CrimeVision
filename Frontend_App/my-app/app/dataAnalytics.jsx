import React, { useEffect, useState } from "react";
import { useLocalSearchParams,useRouter } from "expo-router";
import { View, Text, ScrollView, ActivityIndicator,Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { PieChart,BarChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const colorPalette = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
      "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
      "#F8C471", "#82E0AA", "#F1948A", "#85C1E9", "#D2B4DE",
      "#AED6F1"
  ]; 
const colorMap = {
      total: '#3498DB',
      pending: '#E74C3C',
      solved: '#27AE60'
};

const Legends = () => (
  <View style={styles.legendContainer}>
    {Object.entries(colorMap).map(([key, color]) => (
      <View key={key} style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: color }]} />
        <Text style={styles.legendText}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
      </View>
    ))}
  </View>
);

const DataAnalytics = () => {
    const { station, district } = useLocalSearchParams();
    const route = useRoute();
    const [crimeData, setCrimeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter()
    useEffect(() => {
      const fetchCrimeData = async () => {
        try {
            const encodedStation = encodeURIComponent(station)
            const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/crimeanalytics/${encodedStation}`
            const response = await fetch(url)

            if(!response.ok){
                setLoading(false);
                Alert.alert(
                  "Data Not Found", 
                  `Unable to fetch crime data for ${station}. Please check if the station name is correct.`,
                  [
                    {
                      text: "OK",
                      onPress: () => router.back()
                    }
                  ]
                );
                return;
            }
            
            const data = await response.json();
            
           
            
            setCrimeData(data);
        } catch (error) {
          console.error("Error fetching crime data:", error);
          setLoading(false);
          Alert.alert(
            "Connection Error", 
            "Unable to connect to the server. Please check your internet connection and try again.",
            [
              {
                text: "OK",
                onPress: () => router.back()
              }
            ]
          );
        } finally {
          setLoading(false);
        }
      };
      
      fetchCrimeData();
    }, [station]);
  
    
  
  
    // Check if we have data before rendering
    if (!crimeData || !crimeData.stats) {
      return (
        <SafeAreaView>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 18, textAlign: 'center', color: 'gray' }}>
              No data available for {station}, {district}
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    // Transform types data for Pie Chart
    const pieData = crimeData?.types?.map((item, index) => ({
      value: item.percentage,
      text: item.name, // Crime type label
      color: colorPalette[index % colorPalette.length], // Assign colors cyclically
    }));


    // Bar char code
   

  const barData = Object.entries(crimeData?.stats || {}).flatMap(([crimeType, values]) => [
    {
      value: values.total || 0.1,
      label: crimeType,
      frontColor: colorMap.total,
      spacing: 0,
      labelWidth:80,
      labelTextStyle: { color: 'gray', fontSize: 10, textAlign: 'center' }
    },
    { value: values.pending || 0.1,
       frontColor: colorMap.pending,
       spacing:0 
    },
    { value: values.solved || 0.1, 
      frontColor: colorMap.solved ,
      spacing:30,
    }
  ]);

    if (loading) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498DB" />
            <Text style={styles.loadingText}>Loading Crime Analytics...</Text>
          </View>
        </SafeAreaView>
      );
    }
  
    return (
      
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              {/* <MaterialIcons name="analytics" size={40} color="white" /> */}
              <Text style={styles.headerTitle}>Crime Analytics</Text>
              <Text style={styles.headerSubtitle}>{station}, {district}</Text>
            </View>
          </LinearGradient>

          {/* Statistics Cards */}
          {/* <View style={styles.statsContainer}>
            {Object.entries(crimeData?.stats || {}).map(([type, data], index) => (
              <View key={index} style={styles.statsCard}>
                <Text style={styles.statsCardTitle}>{type}</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: colorMap.total }]}>{data.total || 0}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: colorMap.pending }]}>{data.pending || 0}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: colorMap.solved }]}>{data.solved || 0}</Text>
                    <Text style={styles.statLabel}>Solved</Text>
                  </View>
                </View>
              </View>
            ))}
          </View> */}

          {/* Crime Types Distribution */}
          <View style={[styles.chartCard, styles.firstChartCard]}>
            <View style={styles.chartHeader}>
              <MaterialIcons name="pie-chart" size={24} color="#667eea" />
              <Text style={styles.chartTitle}>Crime Types Distribution</Text>
            </View>
            <Text style={styles.chartSubtitle}>Current Month's Data</Text>
            
            <View style={styles.pieChartContainer}>
              <PieChart
                data={pieData}
                radius={100}
                showText={false}
                innerRadius={50}
                strokeColor="#fff"
                strokeWidth={2}
                focusOnPress={true}
              />
              {/* Center Text */}
              <View style={styles.centerTextContainer}>
                <Text style={styles.centerTitle}>Crime Types</Text>
                <Text style={styles.centerSubtitle}>Distribution</Text>
              </View>
            </View>

                         {/* Pie Chart Legend */}
             <View style={styles.pieChartLegend}>
               {crimeData?.types?.map((item, index) => (
                 <View 
                   key={index} 
                   style={[
                     styles.pieChartLegendItem,
                     { borderLeftColor: colorPalette[index % colorPalette.length] }
                   ]}
                 >
                   <View
                     style={[
                       styles.pieChartLegendDot,
                       { backgroundColor: colorPalette[index % colorPalette.length] }
                     ]}
                   />
                   <Text style={styles.pieChartLegendText}>
                     {item.name}
                   </Text>
                   <Text style={styles.pieChartPercentage}>
                     {item.percentage}%
                   </Text>
                 </View>
               ))}
             </View>
          </View>

          {/* Crime Status Comparison */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <MaterialIcons name="bar-chart" size={24} color="#667eea" />
              <Text style={styles.chartTitle}>Status Comparison</Text>
            </View>
            <Text style={styles.chartSubtitle}>Total vs Pending vs Solved Cases</Text>
            
            <Legends/>
            
            <View style={styles.barChartContainer}>
              <BarChart
                data={barData}
                barWidth={25}
                spacing={3}
                roundedTop
                xAxisThickness={1}
                yAxisThickness={1}
                xAxisColor={'#E0E0E0'}
                yAxisColor={'#E0E0E0'}
                yAxisTextStyle={{ color: '#666', fontSize: 12 }}
                noOfSections={8}
                maxValue={Math.max(...Object.values(crimeData.stats).map(s => s.total)) + 2}
                showGradient
                gradientColor={'rgba(200, 100, 244, 0.3)'}
                rulesLength={225}
                xAxisLength={225} 
              />
            </View>
            
            <Text style={styles.chartHint}>
              📊 Scroll horizontally to view all crime types
            </Text>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop:0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingTop:0,
  },
  headerGradient: {
    paddingTop: 10,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statsCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  firstChartCard: {
    marginTop: 25,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 12,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  pieChartContainer: {
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  externalLabel: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  externalLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2c3e50',
  },
  pieChartLegend: {
    marginTop: 25,
    paddingHorizontal: 10,
  },
  pieChartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  pieChartLegendDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  pieChartLegendText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  pieChartPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#667eea',
    backgroundColor: '#f0f3ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 4,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  barChartContainer: {
    marginVertical: 20,
    paddingHorizontal: 5,
  },
  chartHint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
    marginTop: 16,
  },
  bottomPadding: {
    height: 30,
  },
});

export default DataAnalytics;
