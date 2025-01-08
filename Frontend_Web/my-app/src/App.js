import { BrowserRouter, Routes, Route } from "react-router-dom";
import Police_home_page from "./components/Home_page/Police_home_page";
import District_home_page from "./components/Home_page/District_home_page";
import Loading from "./components/Loading/Loading";
import Sign_in from "./components/Sign_in/Sign_in";
import PoliceDataAnalytics from "./components/Data_analytics/PoliceStation/Police_data_analytics";
import Combined_District_Analytics from "./components/Data_analytics/District/Combined_District_Analytics";
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
      <AlertPopup
        alert={alert}
        onClose={clearAlert}
        onSeeDetails={handleSeeDetails}
        hasInteracted={hasInteracted}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/police_DA" element={<PoliceDataAnalytics />} />
          <Route path="/district_DA" element={<Combined_District_Analytics />} />
          <Route exact path="/" element={<Loading />} />
          <Route path="/signin" element={<Sign_in />} />
          <Route path="/policeHomePage" element={<Police_home_page />} />
          <Route path="/districtHomePage" element={<District_home_page />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      </div>
    </>
  );
}

export default App;
