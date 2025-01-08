import React from 'react';
import { useUser } from '../UserContext/UserContext';
import { Link } from 'react-router-dom';

export default function District_home_page() {
  const { userInfo } = useUser();

  return (
    <div>
      <h1>District Home Page</h1>
      <p><strong>Name:</strong> {userInfo.name}</p>
      <p><strong>Email:</strong> {userInfo.email}</p>
      <p><strong>Phone:</strong> {userInfo.phone}</p>
      <h2>District Details:</h2>
      <p><strong>District Name:</strong> {userInfo.district.name}</p>
      <p><strong>Cases This Month:</strong> {userInfo.district.no_of_cases_this_month}</p>
      <p><strong>Cases Last Month:</strong> {userInfo.district.no_of_cases_last_month}</p>
      <h2>Police Station:</h2>
      {userInfo.policeStation ? (
        <p><strong>Police Station Name:</strong> {userInfo.policeStation.name}</p>
      ) : (
        <p>No Police Station Assigned</p>
      )}
    <Link to="/district_DA">Data Analytics</Link>
    </div>
  );
}
