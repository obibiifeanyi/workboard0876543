
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const BackToAdminButton = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleBackClick = () => {
    if (profile?.account_type === 'admin') {
      navigate('/admin');
    } else if (profile?.account_type === 'manager') {
      navigate('/manager');
    } else if (profile?.account_type === 'accountant') {
      navigate('/accountant');
    } else if (profile?.account_type === 'hr') {
      navigate('/hr');
    } else {
      navigate('/staff');
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleBackClick}
      className="rounded-[30px] border-primary/20 hover:bg-primary/10"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Dashboard
    </Button>
  );
};
