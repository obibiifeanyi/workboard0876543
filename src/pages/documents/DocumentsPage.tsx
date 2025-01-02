import { DashboardLayout } from "@/components/DashboardLayout";
import { DocumentArchive } from "@/components/documents/DocumentArchive";

const DocumentsPage = () => {
  return (
    <DashboardLayout title="Document Archive">
      <DocumentArchive />
    </DashboardLayout>
  );
};

export default DocumentsPage;