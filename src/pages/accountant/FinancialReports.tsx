
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { FinancialReports as FinancialReportsComponent } from "@/components/accountant/FinancialReports";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const FinancialReports = () => {
  return (
    <DashboardLayout
      title="Financial Reports"
      navigation={<AccountantNavigation />}
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex gap-4">
          <AIDocumentButton />
          <BackToAdminButton />
        </div>
      </div>
      <FinancialReportsComponent />
    </DashboardLayout>
  );
};

export default FinancialReports;
