import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { Outlet } from "react-router-dom";

const AccountantDashboard = () => {
  return (
    <DashboardLayout
      title="Accountant Dashboard"
      navigation={<AccountantNavigation />}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default AccountantDashboard;