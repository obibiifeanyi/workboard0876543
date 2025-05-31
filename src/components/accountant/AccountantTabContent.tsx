
import { TabsContent } from "@/components/ui/tabs";
import { FinancialReports } from "./FinancialReports";
import { InvoiceManagement } from "./InvoiceManagement";
import { PaymentProcessing } from "./PaymentProcessing";
import { InventoryManagement } from "./InventoryManagement";
import { MemoApproval } from "./MemoApproval";
import { AccountSettings } from "./AccountSettings";
import { ExpenseManagement } from "@/components/expenses/ExpenseManagement";

export const AccountantTabContent = () => {
  return (
    <>
      <TabsContent value="financial" className="space-y-6 mt-0">
        <FinancialReports />
      </TabsContent>

      <TabsContent value="invoices" className="space-y-6 mt-0">
        <InvoiceManagement />
      </TabsContent>

      <TabsContent value="payments" className="space-y-6 mt-0">
        <PaymentProcessing />
      </TabsContent>

      <TabsContent value="expenses" className="space-y-6 mt-0">
        <ExpenseManagement />
      </TabsContent>

      <TabsContent value="inventory" className="space-y-6 mt-0">
        <InventoryManagement />
      </TabsContent>

      <TabsContent value="memos" className="space-y-6 mt-0">
        <MemoApproval />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6 mt-0">
        <AccountSettings />
      </TabsContent>
    </>
  );
};
