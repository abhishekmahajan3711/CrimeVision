import React, { useEffect, useState } from "react";
import { useLocalSearchParams,useRouter } from "expo-router";
import { View, Text, ScrollView, ActivityIndicator,Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { PieChart,BarChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

const colorPalette = [
      "#aaf609", "#FF5733", "#28B463", "#8E44AD", "#e51ab5",
      "#2E86C1", "gray", "#F39C12", "beige", "purple",
      "green", "#791fe0", "#3498DB", "#A569BD", "#16A085",
      "blue"
  ]; 
const colorMap = {
      total: '#177AD5',
      pending: '#ED6665',
      solved: '#28B463'
};

const Legends = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
    {Object.entries(colorMap).map(([key, color]) => (
      <View key={key} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
        <View style={{ width: 12, height: 12, backgroundColor: color, borderRadius: 6, marginRight: 6 }} />
        <Text style={{ color: 'gray', fontSize: 14 }}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
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
            // Alert.alert("URL",url);
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/crimeanalytics/${station}`)

            if(!response.ok){
                Alert.alert("Data",`Unable to fetch data : ${response.status}`)
                router.replace("/+not-found")
            }
          const data = await response.json();
          setCrimeData(data);
        } catch (error) {
          console.error("Error fetching crime data:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchCrimeData();
    }, [station]);
  
    
  
  
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
      return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }
  
    return (
      <SafeAreaView>
      <ScrollView style={{ padding: 20, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>
        Crime Statistics for {station}, {district}
      </Text>

      
      <View style={{ alignItems: "center", marginBottom: 20 }}>
      <Text style={{ textAlign: 'center', color: 'gray', fontSize: 14, marginBottom: 5 }}>
           Current Month's Data
        </Text>
        <PieChart
          data={pieData}
          radius={120}
          showText
          textColor="black"
          innerRadius={80} // Creates a donut effect
          textSize={10} // Hides text inside Pie Chart
          showValuesAsLabels={true} // Ensures values are not inside the chart
        />
      </View>

      {/* Legend Below Pie Chart */}
      <View style={{ marginTop: 10 }}>
        {crimeData?.types?.map((item, index) => (
          <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: colorPalette[index % colorPalette.length],
                marginRight: 10,
                borderRadius: 3,
              }}
            />
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {item.name}: {item.percentage}%
            </Text>
          </View>
        ))}
      </View>


  
      <View >
      <Text style={{ textAlign: 'center', color: 'gray', fontSize: 14, marginBottom: 5 }}>
            Current Month's Data 
        </Text>
            <Legends/>
            <BarChart
                    data={barData}
                    barWidth={30}
                    spacing={2}
                    

                    xAxisThickness={0}
                    yAxisThickness={0}
                    yAxisTextStyle={{ color: 'gray' }}
                    noOfSections={10}
                    maxValue={Math.max(...Object.values(crimeData.stats).map(s => s.total)) + 2}
            />
    
      </View>
      <View style={{paddingBottom:100}}>
        <Text style={{ textAlign: 'center', color: 'gray', fontSize: 14, marginBottom: 5 }}>
            Swipe left or right to scroll through the chart →
        </Text>
      </View>
      {/* Crime Status */}
      
    </ScrollView>
    </SafeAreaView>)
};





export default DataAnalytics;
