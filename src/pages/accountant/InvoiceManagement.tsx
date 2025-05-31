
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { InvoiceManagement as InvoiceManagementComponent } from "@/components/accountant/InvoiceManagement";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const InvoiceManagement = () => {
  return (
    <DashboardLayout
      title="Invoice Management"
      navigation={<AccountantNavigation />}
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex gap-4">
          <AIDocumentButton />
          <BackToAdminButton />
        </div>
      </div>
      <InvoiceManagementComponent />
    </DashboardLayout>
  );
};

export default InvoiceManagement;
