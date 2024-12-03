import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../UserContext/UserContext";

export default function Loading() {
  const { setUserInfo } = useUser(); // Access the setUserInfo function from context
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Get token from local storage
        const token = localStorage.getItem("Authority_token");

        if (!token) {
          navigate("/signin"); // Redirect to sign-in if no token
          return;
        }
        
        // Verify the token with the backend
        const response = await axios.post("http://localhost:3000/api/v1/web/verifyToken", 
            {},
            {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const policeStationId= response.data.user.policeStation;
        setUserInfo(response.data.user); // Set the user info in context

        // Redirect based on policeStationId
        if (policeStationId === null || policeStationId === "Not Applicable") {
          navigate("/districtHomePage"); // District homepage
        } else {
          navigate("/policeHomePage"); // Police homepage
        }
      } catch (error) {
        console.error("Token verification failed:", error.message);
        navigate("/signin"); // Redirect to sign-in on error
      }
    };

    verifyToken();
  }, [navigate,setUserInfo]);

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
}
