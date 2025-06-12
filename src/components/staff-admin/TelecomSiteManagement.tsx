import React from "react";

export const TelecomSiteManagement = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Telecom Site Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Sites</h3>
          <p className="text-3xl font-bold">45</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Maintenance Due</h3>
          <p className="text-3xl font-bold text-yellow-500">8</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">New Installations</h3>
          <p className="text-3xl font-bold text-green-500">3</p>
        </div>
      </div>

      {/* Site List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Site Updates</h2>
        <div className="space-y-4">
          <div className="p-4 bg-card rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Site Alpha-1</h4>
                <p className="text-sm text-muted-foreground">Last maintenance: 2 days ago</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Operational</span>
            </div>
          </div>
          <div className="p-4 bg-card rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Site Beta-2</h4>
                <p className="text-sm text-muted-foreground">Maintenance due in 3 days</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Warning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 