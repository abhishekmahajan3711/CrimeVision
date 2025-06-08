import { Legend, plugins } from "chart.js";
import React, { useState, useEffect } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import axios from "axios";
import { useUser } from "../../UserContext/UserContext";

const DistrictAnalytics = () => {
  const [dummyData, setData] = useState(null);

  const [selectedStation, setSelectedStation] = useState(
    "Nigdi Police Station"
  );
  const [selectedCrimeTypeForLineDaily, setSelectedCrimeTypeForLineDaily] =
    useState("Fraud"); // Separate state for Pie chart
  const [selectedCrimeTypeForBar, setSelectedCrimeTypeForBar] =
    useState("Murder"); // Separate state for Bar chart
  const [selectedCrimeTypeForLineMonth, setSelectedCrimeTypeForLineMonth] =
    useState("Murder"); // Separate state for Line chart
  const [chartType, setChartType] = useState("Bar");
  const { userInfo }=useUser();

  //for lower half bar/line graph

  const [selectedStation2, setSelectedStation2] = useState(
    "Nigdi Police Station"
  );
  const [chartType2, setChartType2] = useState("Bar");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://crimevision.onrender.com/api/v1/web/district-analytics",
          {
            districtId: userInfo.district._id, //e.g."674dde5bf62a268693cf236f"
          }
        );
        setData(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };
    fetchData();
  }, []);

  if (!dummyData)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          {/* Loading Spinner */}
          <div className="flex justify-center items-center">
            <div className="animate-spin h-12 w-12 border-4 border-gray-300 rounded-full border-t-black"></div>
          </div>
          {/* Loading Text */}
          <p className="text-black text-lg mt-4 font-medium">LOADING...</p>
        </div>
      </div>
    );
    

  // Function to aggregate monthly crime counts for all stations in the district
  const getAggregatedMonthlyCrimeCounts = (crimeType) => {
    const aggregatedData = dummyData.stations.reduce((acc, station) => {
      const monthlyData = dummyData.data[station]?.monthly[crimeType] || [];
      monthlyData.forEach((data, idx) => {
        acc[idx] = (acc[idx] || 0) + data;
      });
      return acc;
    }, []);
    return aggregatedData;
  };

  // Function to aggregate daily crime counts for all stations in the district
  const getAggregatedDailyCrimeCounts = (crimeType) => {
    const aggregatedData = dummyData.stations.reduce((acc, station) => {
      const dailyData = dummyData.data[station]?.daily[crimeType] || [];
      dailyData.forEach((data, idx) => {
        acc[idx] = (acc[idx] || 0) + data;
      });
      return acc;
    }, []);
    return aggregatedData;
  };

  const barLineChartData = {
    labels: dummyData.stations,
    datasets: [
      {
        label: `${selectedCrimeTypeForBar}`,
        data: dummyData.stations.map((station) => {
          const crime = dummyData.data[station]?.types?.find(
            (crime) => crime.type === selectedCrimeTypeForBar
          );
          return crime ? crime.count : 0;
        }),
        backgroundColor: "#e89c76",
        borderColor: "#de692a",
        borderWidth: 1,
      },
    ],
  };

  //for lower half bar/line graph

  const barLineChartData2 = {
    labels: dummyData.crimeTypes,
    datasets: [
      {
        label: "Crime Count",
        data: dummyData.crimeTypes.map((crimeType) => {
          // Check if the selected station has data for the crime type
          const crimeData = dummyData.data[selectedStation2]?.types.find(
            (crime) => crime.type === crimeType
          );

          // If crime data is found, return the count, otherwise return 0
          return crimeData ? crimeData.count : 0;
        }),
        backgroundColor: "pink",
        borderColor: "pink",
        borderWidth: 1,
      },
    ],
  };

  const crimeTypeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Position the legend on the right
        labels: {
          boxWidth: 26, // Size of legend box
          font: {
            size: 12, // Adjust font size
          },
        },
      },
    },
  };


  return (
    <div className="p-2 bg-green-100 grid grid-rows-2 gap-2">
      {/* Upper Half */}
      <div className="grid grid-cols-3 gap-2">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow items-center h-80">
          <h3 className="text-sm font-semibold text-center mb-2">
            Crime Statistics for: {selectedStation}
          </h3>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="border p-1 text-xs rounded w-full mb-2"
          >
            {dummyData.stations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
          <div className="pl-16 h-52">
          <Pie
            height={100}
            data={{
              labels: ["Solved Cases", "Unsolved Cases"],
              datasets: [
                {
                  data: [
                    dummyData.data[selectedStation]?.solvedCases || 0,
                    dummyData.data[selectedStation]?.unsolvedCases || 0,
                  ],
                  backgroundColor: ["#36A2EB", "#FF6384"],
                },
              ],
            }}
            options={crimeTypeOptions}
          />
          </div>
        </div>

        {/* Bar/Line Chart */}
        <div className="col-span-2 bg-white p-4 rounded shadow flex h-80">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-left mb-2">
              Crime Counts ({selectedCrimeTypeForBar})
            </h3>
            <select
              value={selectedCrimeTypeForBar}
              onChange={(e) => setSelectedCrimeTypeForBar(e.target.value)}
              className="border p-1 text-xs rounded w-full mb-2"
            >
              {dummyData.crimeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {chartType === "Bar" ? (
              <Bar data={barLineChartData} height={90} />
            ) : (
              <Line data={barLineChartData} height={90} />
            )}
          </div>
          <div className="flex flex-col ml-4">
            <button
              onClick={() => setChartType("Bar")}
              className={`px-2 py-1 text-xs rounded mb-2 ${
                chartType === "Bar" ?"bg-gray-500 text-white" : "text-black border-2 border-gray-300 rounded"
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType("Line")}
              className={`px-2 py-1 text-xs rounded ${
                chartType === "Line" ? "bg-gray-500 text-white" : "text-black border-2 border-gray-300 rounded"
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      {/* Lower Half */}
      <div className="grid grid-cols-4 gap-2">
        {/* Monthly Crime Count */}
        <div className="bg-white p-4 rounded shadow h-80">
          <h3 className="text-sm font-semibold text-left mb-2">
            Monthly Crime Count ({selectedCrimeTypeForLineMonth})
          </h3>
          <select
            value={selectedCrimeTypeForLineMonth}
            onChange={(e) => setSelectedCrimeTypeForLineMonth(e.target.value)}
            className="border p-1 text-xs rounded w-full mb-2"
          >
            {dummyData.crimeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <Line
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [
                {
                  label: `${selectedCrimeTypeForLineMonth}`,
                  data: getAggregatedMonthlyCrimeCounts(
                    selectedCrimeTypeForLineMonth
                  ),
                  borderColor: "violet",
                  backgroundColor: "violet",
                },
              ],
            }}
            height={180}
          />
        </div>

        {/* Daily Crime Count */}
        <div className="bg-white p-4 rounded shadow h-80">
          <h3 className="text-sm font-semibold text-left mb-2">
            Daily Crime Count ({selectedCrimeTypeForLineDaily})
          </h3>
          <select
            value={selectedCrimeTypeForLineDaily}
            onChange={(e) => setSelectedCrimeTypeForLineDaily(e.target.value)}
            className="border p-1 text-xs rounded w-full mb-2"
          >
            {dummyData.crimeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <Line
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  label: `${selectedCrimeTypeForLineDaily}`,
                  data: getAggregatedDailyCrimeCounts(
                    selectedCrimeTypeForLineDaily
                  ),
                  borderColor: "rgba(75,192,192,1)",
                  backgroundColor: "rgba(75,192,192,0.4)",
                },
              ],
            }}
            height={180}
          />
        </div>

        <div className=" bg-green-100 col-span-2">
          {/* Bar/Line Chart (By Police Station) */}
          <div className="bg-white p-4 rounded shadow h-80">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-semibold text-left">
                Crime Types by Police Station
              </h3>

              {/* Display the selected chart type (Bar or Line) */}
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType2("Bar")}
                  className={`px-4 py-1 text-sm rounded ${
                    chartType2 === "Bar"
                      ? "bg-gray-500 text-white" : "text-black border-2 border-gray-300 rounded"
                  }`}
                >
                  Bar
                </button>
                <button
                  onClick={() => setChartType2("Line")}
                  className={`px-4 py-1 text-sm rounded ${
                    chartType2 === "Line"
                      ? "bg-gray-500 text-white" : "text-black border-2 border-gray-300 rounded"
                  }`}
                >
                  Line
                </button>
              </div>
            </div>

            {/* Dropdown to select police station */}
            <div className="mb-4">
              {/* <label htmlFor="stationSelect" className="text-xs font-semibold">
                Select Police Station:
              </label> */}
              <select
                id="stationSelect"
                value={selectedStation2}
                onChange={(e) => setSelectedStation2(e.target.value)}
                className="border p-2 text-xs rounded w-full mt-1"
              >
                {dummyData.stations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>

            {/* Display the selected chart type (Bar or Line) */}
            {chartType2 === "Bar" ? (
              <Bar data={barLineChartData2} height={100} />
            ) : (
              <Line data={barLineChartData2} height={100} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictAnalytics;
