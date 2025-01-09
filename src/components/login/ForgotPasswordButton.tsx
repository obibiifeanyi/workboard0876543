import React from "react";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";

interface ForgotPasswordButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const ForgotPasswordButton = ({
  onClick,
  disabled
}: ForgotPasswordButtonProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      className="text-sm text-primary hover:text-primary/90 flex items-center gap-1"
      onClick={onClick}
      disabled={disabled}
    >
      <Key className="h-3 w-3" />
      Forgot password?
    </Button>
  );
};