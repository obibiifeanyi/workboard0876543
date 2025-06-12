import React from "react";

export const InventoryManagement = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Value</h3>
          <p className="text-3xl font-bold">$245,000</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-yellow-500">12</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Monthly Expenses</h3>
          <p className="text-3xl font-bold text-green-500">$8,500</p>
        </div>
      </div>
    </div>
  );
};
