
import { TabsContent } from "@/components/ui/tabs";
import { FinancialReports } from "./FinancialReports";
import { InvoiceManagement } from "./InvoiceManagement";
import { PaymentProcessing } from "./PaymentProcessing";
import { InventoryManagement } from "./InventoryManagement";
import { MemoApproval } from "./MemoApproval";
import { AccountSettings } from "./AccountSettings";
import { FleetAccountingManagement } from "./FleetAccountingManagement";
import { ExpenseManagementSystem } from "@/components/expenses/ExpenseManagementSystem";
import { SettingsPage } from "@/components/settings/SettingsPage";

export const AccountantTabContent = () => {
  return (
    <>
      <TabsContent value="overview" className="space-y-6 mt-0">
        <div className="grid gap-6 md:grid-cols-2">
          <FinancialReports />
          <InvoiceManagement />
        </div>
      </TabsContent>

      <TabsContent value="financial-reports" className="space-y-6 mt-0">
        <FinancialReports />
      </TabsContent>

      <TabsContent value="invoices" className="space-y-6 mt-0">
        <InvoiceManagement />
      </TabsContent>

      <TabsContent value="payments" className="space-y-6 mt-0">
        <PaymentProcessing />
      </TabsContent>

      <TabsContent value="inventory" className="space-y-6 mt-0">
        <InventoryManagement />
      </TabsContent>

      <TabsContent value="fleet" className="space-y-6 mt-0">
        <FleetAccountingManagement />
      </TabsContent>

      <TabsContent value="expenses" className="space-y-6 mt-0">
        <ExpenseManagementSystem />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6 mt-0">
        <SettingsPage />
      </TabsContent>
    </>
  );
};
