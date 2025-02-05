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
      className="text-xs text-[#0099ff] hover:text-[#0099ff]/90 flex items-center gap-1 p-0"
      onClick={onClick}
      disabled={disabled}
    >
      <Key className="h-3 w-3" />
      Forgot password?
    </Button>
  );
};