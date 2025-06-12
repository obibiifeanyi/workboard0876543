import React from "react";

const OfficeAdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Office Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Batteries</h3>
          <p className="text-3xl font-bold">156</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">System Status</h3>
          <p className="text-3xl font-bold text-green-500">Online</p>
        </div>
      </div>
    </div>
  );
};

export default OfficeAdminDashboard; 