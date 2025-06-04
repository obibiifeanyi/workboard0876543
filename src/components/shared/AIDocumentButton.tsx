
import { useState, useEffect } from "react";
import { Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AIDocumentAnalyzer } from "@/components/ai/AIDocumentAnalyzer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface AIDocumentButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  buttonText?: string;
}

export const AIDocumentButton = ({
  variant = 'default',
  size = 'default',
  className = '',
  buttonText = 'AI Document Analyzer'
}: AIDocumentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Reset loading state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    // Check if user is logged in before opening
    if (open && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use the AI Document Analyzer.",
        variant: "destructive",
      });
      return;
    }
    
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`${className} ${variant === 'default' ? 'bg-primary hover:bg-primary/90' : ''} rounded-[30px]`}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Brain className="h-4 w-4 mr-2" />
          )}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Document Analyzer</DialogTitle>
          <DialogDescription>
            Upload documents or enter text to analyze with our AI. Get summaries, key points, and insights instantly.
          </DialogDescription>
        </DialogHeader>
        <AIDocumentAnalyzer onLoadingChange={setIsLoading} />
      </DialogContent>
    </Dialog>
  );
};
