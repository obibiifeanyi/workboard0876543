import { useEffect } from "react";
import { DocumentAnalyzer } from "@/components/staff/DocumentAnalyzer";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIDocumentButton } from "@/components/shared/AIDocumentButton";

export default function AIDocumentAnalyzerPage() {
  useEffect(() => {
    document.title = "AI Document Analyzer";
  }, []);
  return (
    <DashboardShell>
      <DashboardHeader
        heading="AI Document Analyzer"
        text="Upload documents to analyze with AI. Get summaries, key points, and insights instantly."
        action={
          <AIDocumentButton 
            variant="outline"
            size="sm"
            buttonText="Advanced Analysis"
          />
        }
      />
      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Document Analysis</CardTitle>
            <CardDescription>
              Upload documents to extract insights, summaries, and key information using AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentAnalyzer />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
