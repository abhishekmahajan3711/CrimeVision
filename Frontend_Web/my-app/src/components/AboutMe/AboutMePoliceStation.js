import React from 'react';
import { useUser } from '../UserContext/UserContext';

export default function AboutMePoliceStation() {
    const { userInfo } = useUser();

    return (
        <div className="max-w-4xl mt-4 mx-auto p-5 bg-blue-50 shadow-lg rounded-lg border border-blue-200">
            {/* Police Station Information */}
            <section className="bg-white p-4 rounded-lg shadow-md border border-green-100 mb-6">
                <h2 className="text-xl font-semibold text-green-700 mb-3">Police Station Information</h2>
                <p className="text-sm font-medium text-green-800">
                    Police Station Name: <span className="font-normal text-teal-600">{userInfo.policeStation.name}</span>
                </p>
                <p className="text-sm font-medium text-green-800">
                    Police Station Address: <span className="font-normal text-teal-600">{userInfo.policeStation.address || "N/A"}</span>
                </p>
            </section>

            {/* Officer Information */}
            <section className="bg-white p-4 rounded-lg shadow-md border border-green-100 mb-6">
                <h1 className="text-xl font-semibold text-green-700 mb-3">PI Officer Information</h1>
                <p className="text-sm font-medium text-green-800">
                    Name: <span className="font-normal text-teal-600">{userInfo.name}</span>
                </p>
                <p className="text-sm font-medium text-green-800">
                    Email: <span className="font-normal text-teal-600">{userInfo.email}</span>
                </p>
                <p className="text-sm font-medium text-green-800">
                    Phone: <span className="font-normal text-teal-600">{userInfo.phone}</span>
                </p>
            </section>

            {/* District Information */}
            <section className="bg-white p-4 rounded-lg shadow-md border border-green-100">
                <h2 className="text-xl font-semibold text-green-700 mb-3">District Information</h2>
                <p className="text-sm font-medium text-green-800">
                    District Name: <span className="font-normal text-teal-600">{userInfo.district.name}</span>
                </p>
            </section>
        </div>
    );
}
