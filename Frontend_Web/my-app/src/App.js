import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserProvider } from "./components/UserContext/UserContext";
import { WebSocketProvider, useWebSocket } from "./components/WebSocket/WebSocketContext";
import AlertPopup from "./components/WebSocket/AlertPopup";
import PoliceDataAnalytics from "./components/Data_analytics/PoliceStation/Police_data_analytics";
import Combined_District_Analytics from "./components/Data_analytics/District/Combined_District_Analytics";
import Loading from "./components/Loading/Loading";
import Sign_in from "./components/Sign_in/Sign_in";
import Police_home_page from "./components/Home_page/Police_home_page";
import District_home_page from "./components/Home_page/District_home_page";
import Filter_PoliceStation from "./components/List_of_Cases_Filter/Filter_PoliceStation";
import Filter_District from "./components/List_of_Cases_Filter/Filter_District";
import Detail_Case2 from "./components/Detail_Case/Detail_Case2";
import List_of_Police_Stations from "./components/List_of_Police_Stations/List_of_Police_Stations";
import AboutMePoliceStation from "./components/AboutMe/AboutMePoliceStation";
import AboutMeDistrict from "./components/AboutMe/AboutMeDistrict";
import CrimeForecast_Police from "./components/Crime_prediction/CrimeForecast_Police";
import CrimeForecast_District from "./components/Crime_prediction/CrimeForecast_District";
import { Toaster } from "react-hot-toast";
import Warnings from "./components/Warnings/Warnings";
import Detail_Case1 from "./components/Detail_Case/Detail_Case1";
import NotificationsList from "./components/Notifications/NotificationsList";
import NotificationDetails from "./components/Notifications/NotificationDetails";

function App() {
  return (
    <BrowserRouter>
      <WebSocketProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </WebSocketProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const { alert, clearAlert } = useWebSocket();
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigate = useNavigate(); // Now it works properly inside Router

  const handleSeeDetails = (alert) => {
    navigate(`/detail_case2/${alert._id}`);
    clearAlert();
  };

  const handleUserInteraction = () => {
    setHasInteracted(true);
  };

  return (
    <>
      <div onClick={handleUserInteraction}>
        {/* Global Alert Popup */}
        <AlertPopup
          alert={alert}
          onClose={clearAlert}
          onSeeDetails={handleSeeDetails}
          hasInteracted={hasInteracted}
        />
        <Routes>
          <Route path="/police_DA" element={<PoliceDataAnalytics />} />
          <Route path="/district_DA" element={<Combined_District_Analytics />} />
          <Route exact path="/" element={<Loading />} />
          <Route path="/signin" element={<Sign_in />} />
          <Route path="/policeHomePage" element={<Police_home_page />} />
          <Route path="/districtHomePage" element={<District_home_page />} />
          <Route path="/police_filter_cases" element={<Filter_PoliceStation />} />
          <Route path="/district_filter_cases" element={<Filter_District />} />
          <Route path="/detail_case1/:id" element={<Detail_Case1 />} />
          <Route path="/detail_case2/:id" element={<Detail_Case2 />} />
          <Route path="/list_of_police_stations" element={<List_of_Police_Stations />} />
          <Route path="/aboutme_policestation" element={<AboutMePoliceStation />} />
          <Route path="/aboutme_district" element={<AboutMeDistrict />} />
          <Route path="/crime_prediction_police" element={<CrimeForecast_Police />} />
          <Route path="/crime_prediction_district" element={<CrimeForecast_District />} />
          <Route path="/warnings" element={<Warnings />} />
          <Route path="/notifications_list" element={<NotificationsList />} />
          <Route path="/notification_details/:id" element={<NotificationDetails />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
