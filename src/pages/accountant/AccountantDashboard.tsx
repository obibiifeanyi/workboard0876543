
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { Outlet, useLocation } from "react-router-dom";
import { AccountantDashboard as AccountantDashboardComponent } from "@/components/accountant/AccountantDashboard";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const AccountantDashboard = () => {
  const location = useLocation();
  const isRootAccountantRoute = location.pathname === '/accountant';

  return (
    <DashboardLayout
      title="Accountant Dashboard"
      navigation={<AccountantNavigation />}
      seoDescription="Comprehensive financial management and accounting dashboard"
      seoKeywords="accounting, financial management, invoices, expenses, reports"
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex gap-4">
          <AIDocumentButton />
          <BackToAdminButton />
        </div>
      </div>
      {isRootAccountantRoute ? <AccountantDashboardComponent /> : <Outlet />}
    </DashboardLayout>
  );
};

export default AccountantDashboard;
