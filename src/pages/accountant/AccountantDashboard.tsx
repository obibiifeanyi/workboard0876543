
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { Outlet, useLocation } from "react-router-dom";
import { AccountantDashboard as AccountantDashboardComponent } from "@/components/accountant/AccountantDashboard";

const AccountantDashboard = () => {
  const location = useLocation();
  const isRootAccountantRoute = location.pathname === '/accountant';

  return (
    <DashboardLayout
      title="Accountant Dashboard"
      navigation={<AccountantNavigation />}
    >
      {isRootAccountantRoute ? <AccountantDashboardComponent /> : <Outlet />}
    </DashboardLayout>
  );
};

export default AccountantDashboard;
