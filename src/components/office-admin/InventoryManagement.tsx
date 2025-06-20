import React from "react";

export const InventoryManagement = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Office Inventory Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Office Supplies</h3>
          <p className="text-3xl font-bold">245</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Equipment</h3>
          <p className="text-3xl font-bold text-yellow-500">12</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Furniture</h3>
          <p className="text-3xl font-bold text-green-500">8</p>
        </div>
      </div>
    </div>
  );
}; 