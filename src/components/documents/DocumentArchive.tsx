import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Project_Report_2024.pdf",
    type: "PDF",
    size: "2.5 MB",
    date: "2024-03-10",
  },
  {
    id: "2",
    name: "Technical_Specifications.docx",
    type: "DOCX",
    size: "1.8 MB",
    date: "2024-03-09",
  },
  {
    id: "3",
    name: "Site_Photos.zip",
    type: "ZIP",
    size: "15.2 MB",
    date: "2024-03-08",
  },
];

export const DocumentArchive = () => {
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Upload Started",
      description: "Your document is being uploaded.",
    });
  };

  const handleDownload = (documentName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${documentName}`,
    });
  };

  const handleDelete = (documentId: string) => {
    toast({
      title: "Document Deleted",
      description: "The document has been removed from the archive.",
    });
  };

  return (
    <Card className="bg-black border-white/10">
      <CardHeader>
        <CardTitle className="text-primary">Document Archive</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-9"
            />
          </div>
          <Button
            onClick={handleUpload}
            className="bg-primary hover:bg-primary/90"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        <div className="space-y-4">
          {mockDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:bg-white/5"
            >
              <div className="flex-1">
                <h4 className="font-medium text-white">{doc.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {doc.type} • {doc.size} • {doc.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(doc.name)}
                  className="text-primary hover:bg-primary/10"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(doc.id)}
                  className="text-primary hover:bg-primary/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};