import { BrowserRouter, Routes, Route } from "react-router-dom";
import Police_home_page from "./components/Home_page/Police_home_page";
import District_home_page from "./components/Home_page/District_home_page";
import Loading from "./components/Loading/Loading";
import Sign_in from "./components/Sign_in/Sign_in";
import PoliceDataAnalytics from "./components/Data_analytics/PoliceStation/Police_data_analytics";
import Combined_District_Analytics from "./components/Data_analytics/District/Combined_District_Analytics";
import Filter_PoliceStation from "./components/List_of_Cases_Filter/Filter_PoliceStation";
import Filter_District from "./components/List_of_Cases_Filter/Filter_District";
import Detail_Case from "./components/Detail_Case/Detail_Case";
import List_of_Police_Stations from "./components/List_of_Police_Stations/List_of_Police_Stations";
import AboutMePoliceStation from "./components/AboutMe/AboutMePoliceStation";
import AboutMeDistrict from "./components/AboutMe/AboutMeDistrict";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./components/UserContext/UserContext";
import {
  WebSocketProvider,
  useWebSocket,
} from "./components/WebSocket/WebSocketContext";
import AlertPopup from "./components/WebSocket/AlertPopup";
import { useState } from "react";

function App() {
  return (
    <WebSocketProvider>
      {/*provides web socket connection globally*/}
      <UserProvider>
        {/*provides data of authority, district or police*/}
        <AppContent />
      </UserProvider>
    </WebSocketProvider>
  );
}

function AppContent() {
  const { alert, clearAlert } = useWebSocket();
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleSeeDetails = (alert) => {
    console.log("See Details clicked:", alert);
    clearAlert(); // Clear the popup
    // Additional actions like navigation can go here
  };

  // Handle user interaction to enable sound playback
  const handleUserInteraction = () => {
    setHasInteracted(true);
  };

  return (
    <>
      <div onClick={handleUserInteraction}>
        {/* Global Alert Popup */}

        <BrowserRouter>
          <AlertPopup
            alert={alert}
            onClose={clearAlert}
            onSeeDetails={handleSeeDetails}
            hasInteracted={hasInteracted}
          />
          <Routes>
            <Route path="/police_DA" element={<PoliceDataAnalytics />} />
            <Route
              path="/district_DA"
              element={<Combined_District_Analytics />}
            />
            <Route exact path="/" element={<Loading />} />
            <Route path="/signin" element={<Sign_in />} />
            <Route path="/policeHomePage" element={<Police_home_page />} />
            <Route path="/districtHomePage" element={<District_home_page />} />
            <Route
              path="/police_filter_cases"
              element={<Filter_PoliceStation />}
            />
            <Route
              path="/district_filter_cases"
              element={<Filter_District />}
            />
            <Route path="/detail_case" element={<Detail_Case />} />
            <Route
              path="/list_of_police_stations"
              element={<List_of_Police_Stations />}
            />
            <Route
              path="/aboutme_policestation"
              element={<AboutMePoliceStation />}
            />
            <Route path="/aboutme_district" element={<AboutMeDistrict />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </>
  );
}

export default App;
