
import { DashboardLayout } from "@/components/DashboardLayout";
import { DocumentManagement } from "@/components/documents/DocumentManagement";
import { BackToAdminButton } from "@/components/shared/BackToAdminButton";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";

const DocumentsPage = () => {
  return (
    <DashboardLayout title="Document Management">
      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex gap-4">
          <AIDocumentButton />
          <BackToAdminButton />
        </div>
      </div>
      <DocumentManagement />
    </DashboardLayout>
  );
};

export default DocumentsPage;
