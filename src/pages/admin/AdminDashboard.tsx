import { DashboardLayout } from "@/components/DashboardLayout";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <DashboardLayout 
      title="Admin Dashboard"
      navigation={<AdminNavigation />}
    >
      <div className="p-6">
        <Outlet />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;