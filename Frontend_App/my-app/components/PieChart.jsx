import { View,Text } from "react-native";
const PieChart = ({ solved, pending }) => {
    const total = solved + pending;
    const solvedPercentage = (solved / total) * 100; // Percentage of solved cases
  
    return (
      <View style={{ alignItems: "center", marginTop: 20 }}>
        {/* Pie Chart Container */}
        <View
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: "red", // Pending cases color
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Solved Cases Section (Overlap & Rotate) */}
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "green", // Solved cases color
              position: "absolute",
              opacity:0.8,
              top: 0,
              left: 0,
              transform: [{ rotate: `${(solvedPercentage / 100) * 360}deg` }], // Rotate based on percentage
              borderTopRightRadius: 75,
              borderBottomRightRadius: 75,
            }}
          />
        </View>
  
        {/* Case Count Text Below Pie Chart */}
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>Total: {total}</Text>
        <Text style={{ fontSize: 16, color: "green" }}>Solved: {solved}</Text>
        <Text style={{ fontSize: 16, color: "red" }}>Pending: {pending}</Text>
      </View>
    );
  };
  export default PieChart;