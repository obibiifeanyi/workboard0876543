
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIDocumentAnalyzer } from "@/components/ai/AIDocumentAnalyzer";

const DocumentsPage = () => {
  return (
    <DashboardLayout title="AI Document Analyzer">
      <div className="p-6">
        <AIDocumentAnalyzer />
      </div>
    </DashboardLayout>
  );
};

export default DocumentsPage;
