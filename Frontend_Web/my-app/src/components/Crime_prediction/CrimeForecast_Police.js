import React, { useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const districtMapping = {
    "Aurangabad": 0, "Buldhana": 1, "Kolhapur": 2, "Mumbai": 3,
    "Nagpur": 4, "Nashik": 5, "Pune": 6, "Ratnagiri": 7, "Thane": 8
};

const stationMapping = {
    "Airport Police Station": 0, "Ajni Police Station": 1, "Andheri Police Station": 2,
    "Azad Maidan Police Station": 3, "Bhadrakali Police Station": 4, "Bharti Vidyapeeth Police Station": 5,
    "Bhosari Police Station": 6, "Buldhana City Police Station": 7, "Cantonment Police Station": 8,"Chandan Nagar Police Station": 9,
    "Chaturshrungi Police Station": 10, "Chikhli Police Station": 11, "Chiplun Police Station": 12,
    "City Chowk Police Station": 13, "Colaba Police Station": 14, "Dadar Police Station": 15,
    "Dapoli Police Station": 16, "Dattawadi Police Station": 17, "Deccan Gymkhana Police Station": 18,
    "Deccan Police Station": 19, "Dhantoli Police Station": 20, "Dighi Police Station": 21,
    "Faraskhana Police Station": 22, "Gangapur Road Police Station": 23, "Hadapsar Police Station": 24,
    "Karveer Police Station": 25, "Katraj Police Station": 26, "Khadki Police Station": 27,
    "Khamgaon Police Station": 28, "Khed Police Station": 29, "Kondhwa Police Station": 30,
    "Kopri Police Station": 31, "Koregaon Park Police Station": 32, "Kothrud Police Station": 33,
    "Kranti Chowk Police Station": 34, "Malkapur Police Station": 35, "Market Yard Police Station": 36,
    "Mukundwadi Police Station": 37, "Mundhwa Police Station": 38, "Naupada Police Station": 39,
    "Nigdi Police Station": 40, "Panchavati Police Station": 41, "Rajwada Police Station": 42,
    "Ramwadi Police Station": 43, "Ratnagiri City Police Station": 44, "Sadar Police Station": 45,
    "Sahakar Nagar Police Station": 46, "Satpur Police Station": 47, "Shahupuri Police Station": 48,
    "Shivaji Peth Police Station": 49, "Shivajinagar Police Station": 50, "Sitabuldi Police Station": 51,
    "Swargate Police Station": 52, "Vartak Nagar Police Station": 53, "Vimantal Police Station": 54,
    "Vishrambaug Police Station": 55, "Wagle Estate Police Station": 56, "Warje Police Station": 57,
    "Yerwada Police Station": 58,
};

const alertTypeMapping = {
    "Accident": 0, "Cybercrime": 1, "Fight": 2, "Fraud": 3, "Hit and Run": 4,
    "Kidnapping": 5, "Murder": 6, "Other": 7, "Rape": 8, "Robbery": 9
};

const CrimeForecast_Police = () => {
    const [district, setDistrict] = useState("");
    const [station, setStation] = useState("");
    const [alertType, setAlertType] = useState("");
    const [predictions, setPredictions] = useState([]);
    const [chartType, setChartType] = useState("bar");
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        if (!district || !station || !alertType) {
            alert("Please select all inputs");
            return;
        }
    
        setLoading(true);
        const requestData = {
            district_id: districtMapping[district],
            station_id: stationMapping[station],
            alert_id: alertTypeMapping[alertType]
        };
    
        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", requestData);
            console.log("API Response:", response.data);
            setPredictions(Array.isArray(response.data) ? response.data.map(Number) : []);
        } catch (error) {
            console.error("Error fetching prediction", error);
        }
        setLoading(false);
    };

    const averageCrime = predictions.length ? (predictions.reduce((a, b) => a + b, 0) / predictions.length).toFixed(2) : "-";

    return (
        <div className="max-w-5xl mx-auto m-4 p-8 bg-gray-900 text-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Crime Prediction Next Week</h1>
            <div className="flex flex-wrap justify-center gap-4 items-center mb-6">
                <select className="border p-2 rounded bg-gray-800" onChange={(e) => setDistrict(e.target.value)}>
                    <option value="">Select District</option>
                    {Object.keys(districtMapping).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
                <select className="border p-2 rounded bg-gray-800" onChange={(e) => setStation(e.target.value)}>
                    <option value="">Select Police Station</option>
                    {Object.keys(stationMapping).map((key) => <option key={key} value={key}>{key}</option>)}
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

export default CrimeForecast_Police;
