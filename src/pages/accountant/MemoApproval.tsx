
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { MemoApproval as MemoApprovalComponent } from "@/components/accountant/MemoApproval";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";

const MemoApproval = () => {
  return (
    <DashboardLayout
      title="Memo Approval"
      navigation={<AccountantNavigation />}
      seoDescription="Manage and approve memo submissions from staff members"
      seoKeywords="memo approval, accountant dashboard, document management"
    >
      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex gap-4">
          <AIDocumentButton />
          <BackToAdminButton />
        </div>
      </div>
      <MemoApprovalComponent />
    </DashboardLayout>
  );
};

export default MemoApproval;
