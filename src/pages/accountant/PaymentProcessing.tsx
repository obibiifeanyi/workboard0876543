
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { PaymentProcessing as PaymentProcessingComponent } from "@/components/accountant/PaymentProcessing";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const PaymentProcessing = () => {
  return (
    <DashboardLayout
      title="Payment Processing"
      navigation={<AccountantNavigation />}
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex gap-4">
          <AIDocumentButton />
          <BackToAdminButton />
        </div>
      </div>
      <PaymentProcessingComponent />
    </DashboardLayout>
  );
};

export default PaymentProcessing;
