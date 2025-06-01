
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { AccountSettings } from "@/components/accountant/AccountSettings";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const AccountantSettings = () => {
  return (
    <DashboardLayout
      title="Accountant Settings"
      navigation={<AccountantNavigation />}
      seoDescription="Configure accountant preferences and settings"
      seoKeywords="settings, preferences, configuration, accounting"
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <BackToAdminButton />
      </div>
      <AccountSettings />
    </DashboardLayout>
  );
};

export default AccountantSettings;
