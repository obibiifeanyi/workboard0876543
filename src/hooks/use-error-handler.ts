import { useToast } from "@/hooks/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error: unknown) => {
    console.error('Error:', error);

    if (error instanceof Error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (error && typeof error === 'object' && 'message' in error) {
      toast({
        title: "Error",
        description: String(error.message),
        variant: "destructive",
      });
      return;
    }

    if (error && typeof error === 'object' && 'code' in error) {
      const pgError = error as PostgrestError;
      toast({
        title: "Database Error",
        description: pgError.message || "An unexpected database error occurred",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
  };

  return { handleError };
}; 