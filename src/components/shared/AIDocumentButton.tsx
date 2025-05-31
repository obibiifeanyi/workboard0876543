
import { useState } from "react";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AIDocumentAnalyzer } from "@/components/ai/AIDocumentAnalyzer";

export const AIDocumentButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-[30px] bg-primary hover:bg-primary/90">
          <Brain className="h-4 w-4 mr-2" />
          AI Document Analyzer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Document Analyzer</DialogTitle>
        </DialogHeader>
        <AIDocumentAnalyzer />
      </DialogContent>
    </Dialog>
  );
};
