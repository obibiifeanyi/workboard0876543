import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface RememberMeCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const RememberMeCheckbox = ({
  checked,
  onCheckedChange,
  disabled
}: RememberMeCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="remember" 
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      <label
        htmlFor="remember"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Remember me
      </label>
    </div>
  );
};