import React, { useState, useEffect } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import { useUser } from '../../UserContext/UserContext';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const PoliceDataAnalytics = () => {
    const [data, setData] = useState(null);
    const [chartType, setChartType] = useState('Bar');
    const [filter1, setFilter1] = useState('Fight');
    const [filter2, setFilter2] = useState('Fight');
    const [filter3, setFilter3] = useState('Fight');
    const { userInfo }=useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('https://crimevision.onrender.com/api/v1/web/police-station-analytics', {
                    stationId: userInfo.policeStation._id, //e.g "674dde5bf62a268693cf2371"
                });
                setData(response.data);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };
        fetchData();
    }, []);
    console.log(data);
    if (!data)return (
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

    const crimeTypeData = {
        labels: data.types.map(type => type.name),
        datasets: [
            {
                data: data.types.map(type => type.percentage),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    const crimeBarData = {
        labels: data.crimeCounts.map(c => c.name),
        datasets: [
            {
                label: 'Crime Count',
                data: data.crimeCounts.map(c => c.count),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    const sectionData = (filter, dataType) => ({
        labels: dataType === 'monthly'
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
            {
                label: `${filter} Count`,
                data: data[dataType][filter],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            },
        ],
    });

    const statsData = (filter) => ({
        labels: ['Total', 'Pending', 'Solved'],
        datasets: [
            {
                data: [
                    data.stats[filter].total,
                    data.stats[filter].pending,
                    data.stats[filter].solved,
                ],
                label: `${filter} Count`,
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
        ],
    });

    const crimeTypeOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right', // Position the legend on the right
                labels: {
                    boxWidth: 10, // Size of legend box
                    font: {
                        size: 10, // Adjust font size
                    },
                },
            },
        },
    };

    return (
        <div className="p-2 bg-green-100 grid grid-rows-2 gap-2">
            {/* Upper Half */}
            <div className="grid grid-cols-3 gap-2">
                {/* Pie Chart (35%) */}
                <div className="bg-white p-4 rounded shadow items-center h-80">
                    <h3 className="text-sm font-semibold text-center mb-2">Crime Type Percentage</h3>
                    <Pie data={crimeTypeData} options={crimeTypeOptions}/>
                </div>

                {/* Bar/Line Chart (65%) */}
                <div className="col-span-2 bg-white p-4 rounded shadow flex h-80">
                    {/* Chart and Buttons Section */}
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-left mb-2">Crime Counts</h3>
                        {chartType === 'Bar' ? <Bar data={crimeBarData} height={100} /> : <Line data={crimeBarData} height={100}/>}
                    </div>

                    {/* Buttons for Chart Type */}
                    <div className="flex flex-col ml-4">
                        <button
                            onClick={() => setChartType('Bar')}
                            className={`px-2 py-1 text-xs rounded mb-2 ${chartType === 'Bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            Bar
                        </button>
                        <button
                            onClick={() => setChartType('Line')}
                            className={`px-2 py-1 text-xs rounded ${chartType === 'Line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            Line
                        </button>
                    </div>
                </div>
            </div>

            {/* Lower Half */}
            <div className="grid grid-cols-3 gap-2 h-48">
                {/* Crime Statistics */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-sm font-semibold text-center mb-2">Crime Statistics</h3>
                    <select
                        value={filter1}
                        onChange={(e) => setFilter1(e.target.value)}
                        className="border p-1 text-xs rounded w-full mb-2"
                    >
                        {Object.keys(data.stats).map(crime => (
                            <option key={crime} value={crime}>{crime}</option>
                        ))}
                    </select>
                    <Bar data={statsData(filter1)} />
                </div>

                {/* Monthly Trend */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-sm font-semibold text-center mb-2">Monthly Trend</h3>
                    <select
                        value={filter2}
                        onChange={(e) => setFilter2(e.target.value)}
                        className="border p-1 text-xs rounded w-full mb-2"
                    >
                        {Object.keys(data.monthly).map(crime => (
                            <option key={crime} value={crime}>{crime}</option>
                        ))}
                    </select>
                    <Line data={sectionData(filter2, 'monthly')} />
                </div>

                {/* Daily Trend */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-sm font-semibold text-center mb-2">Daily Trend</h3>
                    <select
                        value={filter3}
                        onChange={(e) => setFilter3(e.target.value)}
                        className="border p-1 text-xs rounded w-full mb-2"
                    >
                        {Object.keys(data.daily).map(crime => (
                            <option key={crime} value={crime}>{crime}</option>
                        ))}
                    </select>
                    <Line data={sectionData(filter3, 'daily')} />
                </div>
            </div>
        </div>
    );
};

export default PoliceDataAnalytics;
