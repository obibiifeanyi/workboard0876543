
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { InventoryManagement as InventoryManagementComponent } from "@/components/accountant/InventoryManagement";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const InventoryManagement = () => {
  return (
    <DashboardLayout
      title="Inventory Management"
      navigation={<AccountantNavigation />}
      seoDescription="Manage assets and inventory"
      seoKeywords="inventory, assets, equipment, tracking"
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <BackToAdminButton />
      </div>
      <InventoryManagementComponent />
    </DashboardLayout>
  );
};

export default InventoryManagement;
