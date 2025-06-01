
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { FinancialReports as FinancialReportsComponent } from "@/components/accountant/FinancialReports";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const FinancialReports = () => {
  return (
    <DashboardLayout
      title="Financial Reports"
      navigation={<AccountantNavigation />}
      seoDescription="Generate and manage financial reports"
      seoKeywords="financial reports, accounting, balance sheet, income statement"
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <BackToAdminButton />
      </div>
      <FinancialReportsComponent />
    </DashboardLayout>
  );
};

export default FinancialReports;
