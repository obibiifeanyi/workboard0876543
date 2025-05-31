
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { InventoryManagement as InventoryManagementComponent } from "@/components/accountant/InventoryManagement";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const InventoryManagement = () => {
  return (
    <DashboardLayout
      title="Inventory Management"
      navigation={<AccountantNavigation />}
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex gap-4">
          <AIDocumentButton />
          <BackToAdminButton />
        </div>
      </div>
      <InventoryManagementComponent />
    </DashboardLayout>
  );
};

export default InventoryManagement;
