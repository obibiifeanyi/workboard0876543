
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { PaymentProcessing as PaymentProcessingComponent } from "@/components/accountant/PaymentProcessing";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const PaymentProcessing = () => {
  return (
    <DashboardLayout
      title="Payment Processing"
      navigation={<AccountantNavigation />}
      seoDescription="Process payments and transactions"
      seoKeywords="payments, transactions, processing, banking"
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <BackToAdminButton />
      </div>
      <PaymentProcessingComponent />
    </DashboardLayout>
  );
};

export default PaymentProcessing;
