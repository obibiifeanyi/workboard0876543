import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountManagement } from "@/components/account/AccountManagement";

const AccountPage = () => {
  return (
    <DashboardLayout title="Account Management">
      <AccountManagement />
    </DashboardLayout>
  );
};

export default AccountPage;