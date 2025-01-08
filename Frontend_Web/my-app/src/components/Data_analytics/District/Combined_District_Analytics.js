import React, { useState, useRef, useEffect } from "react";
import PinMapView from "./PinMapView.js";
import HeatMapView from "./HeatMapView.js";
import DistrictAnalytics from "./District_data_analytics.js";

const Combined_District_Analytics = () => {
    const [activeView, setActiveView] = useState("PinMapView");
    const componentRef = useRef(null);

    // Ensure the "Data Visualization" component is focused
    useEffect(() => {
        if (activeView === "DataVisualization" && componentRef.current) {
            componentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [activeView]);

    const renderView = () => {
        switch (activeView) {
            case "PinMapView":
                return <PinMapView />;
            case "HeatMapView":
                return <HeatMapView />;
            case "DataVisualization":
                return <DistrictAnalytics />;
            default:
                return <PinMapView />;
        }
    };

    return (
        <div>
            <div className="flex justify-between p-2 items-center">
                <div className="">
                    <label htmlFor="district">District: </label>
                    <span id="district" className="font-semibold">Pune</span>
                </div>

                <div className="flex gap-2">
                    <button
                        className={`px-4 py-2 ${activeView === "PinMapView" ? "bg-gray-800 text-white rounded" : "text-black border-2 border-gray-300 rounded"}`}
                        onClick={() => setActiveView("PinMapView")}
                    >
                        <p className="text-sm">Pin Map View</p>
                    </button>
                    <button
                        className={`px-4 py-2 ${activeView === "HeatMapView" ? "bg-gray-800 text-white rounded" : "text-black border-2 border-gray-300 rounded"}`}
                        onClick={() => setActiveView("HeatMapView")}
                    >
                        <p className="text-sm">Heat Map View</p>
                    </button>
                    <button
                        className={`px-4 py-2 ${activeView === "DataVisualization" ? "bg-gray-800 text-white rounded" : "text-black border-2 border-gray-300 rounded"}`}
                        onClick={() => setActiveView("DataVisualization")}
                    >
                        <p className="text-sm">Data Visualization</p>
                    </button>
                </div>
            </div>

            <div ref={componentRef} className="">
                {renderView()}
            </div>
        </div>
    );
};

export default Combined_District_Analytics;
