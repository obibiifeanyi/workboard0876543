
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedMemoForm } from "./EnhancedMemoForm";
import { Users, Building } from "lucide-react";

interface SendMemoFormProps {
  onMemoSent?: () => void;
}

export const SendMemoForm = ({ onMemoSent }: SendMemoFormProps) => {
  return (
    <Tabs defaultValue="individual" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-black/5 dark:bg-white/5 rounded-[30px]">
        <TabsTrigger value="individual" className="flex items-center gap-2 rounded-[30px]">
          <Users className="h-4 w-4" />
          Individual
        </TabsTrigger>
        <TabsTrigger value="department" className="flex items-center gap-2 rounded-[30px]">
          <Building className="h-4 w-4" />
          Department
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="individual" className="mt-6">
        <EnhancedMemoForm type="individual" onMemoSent={onMemoSent} />
      </TabsContent>
      
      <TabsContent value="department" className="mt-6">
        <EnhancedMemoForm type="department" onMemoSent={onMemoSent} />
      </TabsContent>
    </Tabs>
  );
};
