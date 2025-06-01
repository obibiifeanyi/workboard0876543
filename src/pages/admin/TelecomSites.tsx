
import { DashboardLayout } from "@/components/DashboardLayout";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { TelecomSiteManagement } from "@/components/admin/TelecomSiteManagement";

const TelecomSites = () => {
  return (
    <DashboardLayout
      title="Telecom Sites Management"
      navigation={<AdminNavigation />}
      seoDescription="Manage telecom sites, locations, and infrastructure"
      seoKeywords="telecom, sites, infrastructure, management"
    >
      <TelecomSiteManagement />
    </DashboardLayout>
  );
};

export default TelecomSites;
