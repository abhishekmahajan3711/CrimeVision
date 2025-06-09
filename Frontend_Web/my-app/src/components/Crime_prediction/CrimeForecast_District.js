import React, { useState, useContext } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { useUser } from "../UserContext/UserContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const districtMapping = {
    "Aurangabad": 0, "Buldhana": 1, "Kolhapur": 2, "Mumbai": 3,
    "Nagpur": 4, "Nashik": 5, "Pune": 6, "Ratnagiri": 7, "Thane": 8
};

const alertTypeMapping = {
    "Accident": 0, "Cybercrime": 1, "Fight": 2, "Fraud": 3, "Hit and Run": 4,
    "Kidnapping": 5, "Murder": 6, "Other": 7, "Rape": 8, "Robbery": 9
};

// Default station mapping for district-level predictions (using first station of each district)
const districtDefaultStation = {
    "Aurangabad": 0, "Buldhana": 7, "Kolhapur": 25, "Mumbai": 3,
    "Nagpur": 1, "Nashik": 23, "Pune": 6, "Ratnagiri": 44, "Thane": 31
};

const CrimeForecast_District = () => {
    const { userInfo } = useUser();
    
    // Set default district from context and don't allow it to change
    const defaultDistrict = userInfo?.district?.name || "";
    
    const [district, setDistrict] = useState(defaultDistrict);
    const [alertType, setAlertType] = useState("");
    const [predictions, setPredictions] = useState([]);
    const [chartType, setChartType] = useState("bar");
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        if (!district || !alertType) {
            alert("Please select all inputs");
            return;
        }
    
        setLoading(true);
        const requestData = {
            district_id: districtMapping[district],
            station_id: districtDefaultStation[district],
            alert_id: alertTypeMapping[alertType]
        };
    
        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", requestData);
            console.log("API Response:", response.data);
            // Multiply the response data by 7 as requested
            const multipliedData = Array.isArray(response.data) ? response.data.map(value => Number(value) * 3) : [];
            setPredictions(multipliedData);
        } catch (error) {
            console.error("Error fetching prediction", error);
        }
        setLoading(false);
    };

    const averageCrime = predictions.length ? (predictions.reduce((a, b) => a + b, 0) / predictions.length).toFixed(2) : "-";

    return (
        <div className="max-w-5xl mx-auto m-4 p-8 bg-gray-900 text-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-6">District Crime Prediction Next Week</h1>
            <div className="flex flex-wrap justify-center gap-4 items-center mb-6">
                <select className="border p-2 rounded bg-gray-800" value={district} onChange={(e) => setDistrict(e.target.value)} disabled>
                    <option value="">Select District</option>
                    {Object.keys(districtMapping).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
                <select className="border p-2 rounded bg-gray-800" onChange={(e) => setAlertType(e.target.value)}>
                    <option value="">Select Crime Type</option>
                    {Object.keys(alertTypeMapping).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
                <button className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition" onClick={handlePredict}>
                    {loading ? "Predicting..." : "Predict"}
                </button>
            </div>
            {!loading && predictions.length > 0 && (
                <>
                    <h2 className="text-center text-lg font-semibold mb-2">Average Crimes in next 7 Days: <span className="text-yellow-400 font-bold">{averageCrime}</span></h2>
                    <div className="w-full flex justify-center mb-4">
                        <button className={`px-4 py-2 mx-2 rounded ${chartType === "bar" ? "bg-orange-700 text-white" : "bg-gray-700 text-gray-300"}`} onClick={() => setChartType("bar")}>Bar Chart</button>
                        <button className={`px-4 py-2 mx-2 rounded ${chartType === "line" ? "bg-orange-700 text-white" : "bg-gray-700 text-gray-300"}`} onClick={() => setChartType("line")}>Line Chart</button>
                    </div>
                    <div className="max-w-lg mx-auto">{chartType === "bar" ? <Bar data={{ labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], datasets: [{ label: "Predicted Crimes", data: predictions,backgroundColor: "rgba(255,99,132,0.5)",borderColor:"rgba(255,99,132,1)",borderWidth:2 }] }} /> : <Line data={{ labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], datasets: [{ label: "Predicted Crimes", data: predictions,backgroundColor:"rgba(255,99,132,0.5)",borderColor:"rgba(255,99,132,1)",borderWidth:2}] }} />}</div>
                </>
            )}
        </div>
    );
};

export default CrimeForecast_District; 