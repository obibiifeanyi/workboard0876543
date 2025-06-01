
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { InvoiceManagement as InvoiceManagementComponent } from "@/components/accountant/InvoiceManagement";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const InvoiceManagement = () => {
  return (
    <DashboardLayout
      title="Invoice Management"
      navigation={<AccountantNavigation />}
      seoDescription="Manage and process invoices"
      seoKeywords="invoices, payments, accounts payable, billing"
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <BackToAdminButton />
      </div>
      <InvoiceManagementComponent />
    </DashboardLayout>
  );
};

export default InvoiceManagement;
