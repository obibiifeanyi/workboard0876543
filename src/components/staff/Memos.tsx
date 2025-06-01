
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendMemoForm } from "@/components/memos/SendMemoForm";
import { UserMemoManagement } from "@/components/memos/UserMemoManagement";
import { ReceivedMemos } from "@/components/memos/ReceivedMemos";
import { SentMemos } from "@/components/memos/SentMemos";
import { FileText, Send, Inbox, Mail, FileCheck } from "lucide-react";

export const Memos = () => {
  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Memos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="management" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="management" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              My Memos
            </TabsTrigger>
            <TabsTrigger value="received" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Received
            </TabsTrigger>
            <TabsTrigger value="send" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Sent
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="management" className="mt-6">
            <UserMemoManagement />
          </TabsContent>
          
          <TabsContent value="received" className="mt-6">
            <ReceivedMemos />
          </TabsContent>
          
          <TabsContent value="send" className="mt-6">
            <SendMemoForm />
          </TabsContent>
          
          <TabsContent value="sent" className="mt-6">
            <SentMemos />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
