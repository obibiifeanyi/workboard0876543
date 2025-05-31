
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { AccountSettings as AccountSettingsComponent } from "@/components/accountant/AccountSettings";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const AccountantSettings = () => {
  return (
    <DashboardLayout
      title="Accountant Settings"
      navigation={<AccountantNavigation />}
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex gap-4">
          <AIDocumentButton />
          <BackToAdminButton />
        </div>
      </div>
      <AccountSettingsComponent />
    </DashboardLayout>
  );
};

export default AccountantSettings;
