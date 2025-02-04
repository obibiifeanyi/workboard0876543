import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck } from "lucide-react";

export const MemoApproval = () => {
  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <FileCheck className="h-5 w-5 text-primary" />
          Memo Approval
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Implement memo approval UI here */}
        <div>Memo approval content will go here</div>
      </CardContent>
    </Card>
  );
};