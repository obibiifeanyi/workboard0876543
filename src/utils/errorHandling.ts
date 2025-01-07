import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useErrorHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleError = (error: unknown, redirectPath?: string) => {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });

    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  return { handleError };
};