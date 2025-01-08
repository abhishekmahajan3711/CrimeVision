import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Sign_in = () => {
  const [formData, setFormData] = useState({
    district: "",
    policeStation: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/web/signin",
        formData
      );
      // Save token in localStorage
      if (response) {
        localStorage.setItem("Authority_token", response.data.token);
        toast.success("Login Successful");
        navigate("/");
      } else {
        toast.error("Failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className=" mt-2 text-4xl font-bold text-gray-700 text-center">
          Goverment of India
        </h2>
        <p className=" mb-5 text-base font-light text-gray-600 text-center">
          Please enter your login details below
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* District Selection */}
          <div>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              className="w-full border text-gray-500 border-green-300 rounded-lg px-3 py-2 mt-1 focus:border-gray-500 focus:text-black"
            >
              <option value="" disabled hidden>
                Select District
              </option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          {/* Police Station Selection */}
          <div>
            <select
              id="policeStation"
              name="policeStation"
              value={formData.policeStation}
              onChange={handleChange}
              required
              className="w-full text-gray-500 border border-green-300 rounded-lg px-3 py-2 mt-1  focus:border-gray-500 focus:text-black"
            >
              <option value="" disabled hidden>
                Select Police Station
              </option>
              <option value="Not Applicable">Not Applicable</option>
              {/* <option value="Airport Police Station">
                Airport Police Station
              </option>
              <option value="Bharti Vidyapeeth Police Station">
                Bharti Vidyapeeth Police Station
              </option>
              <option value="Bhosari Police Station">
                Bhosari Police Station
              </option>
              <option value="Chandan Nagar Police Station">
                Chandan Nagar Police Station
              </option>
              <option value="Chaturshrungi Police Station">
                Chaturshrungi Police Station
              </option> */}
              <option value="Dattawadi Police Station">
                Dattawadi Police Station
              </option>
              <option value="Deccan Police Station">
                Deccan Police Station
              </option>
              {/* <option value="Dighi Police Station">Dighi Police Station</option>
              <option value="Faraskhana Police Station">
                Faraskhana Police Station
              </option>
              <option value="Katraj Police Station">
                Katraj Police Station
              </option> */}
              <option value="Khadki Police Station">
                Khadki Police Station
              </option>
              <option value="Kondhwa Police Station">
                Kondhwa Police Station
              </option>
              <option value="Hadapsar Police Station">
                Hadapsar Police Station
              </option>
              <option value="Koregaon Park Police Station">
                Koregaon Park Police Station
              </option>
              <option value="Market Yard Police Station">
                Market Yard Police Station
              </option>
              <option value="Mundhwa Police Station">
                Mundhwa Police Station
              </option>
              <option value="Nigdi Police Station">Nigdi Police Station</option>
              {/* <option value="Ramwadi Police Station">
                Ramwadi Police Station
              </option>
              <option value="Sahakar Nagar Police Station">
                Sahakar Nagar Police Station
              </option>
              <option value="Shivaji Nagar Police Station">
                Shivaji Nagar Police Station
              </option>
              <option value="Swargate Police Station">
                Swargate Police Station
              </option>
              <option value="Vimantal Police Station">
                Vimantal Police Station
              </option>
              <option value="Vishrambaug Police Station">
                Vishrambaug Police Station
              </option>
              <option value="Warje Police Station">Warje Police Station</option>
              <option value="Yerwada Police Station">
                Yerwada Police Station
              </option> */}
            </select>
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full border border-green-300 rounded-lg px-3 py-2 mt-1  focus:border-gray-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-green-300 rounded-lg px-3 py-2 mt-1 focus:border-gray-500"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEyeSlash /> : <MdOutlineRemoveRedEye />}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sign_in;
