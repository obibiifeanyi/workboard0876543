
import { DashboardLayout } from "@/components/DashboardLayout";
import { SettingsPage as Settings } from "@/components/settings/SettingsPage";

export const SettingsPage = () => {
  return (
    <DashboardLayout 
      title="Settings"
      seoDescription="CT Communication Towers Settings - Manage your account preferences and system settings"
      seoKeywords="settings, preferences, account management, notifications"
    >
      <Settings />
    </DashboardLayout>
  );
};

export default SettingsPage;
