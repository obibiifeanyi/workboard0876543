
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendMemoForm } from "@/components/memos/SendMemoForm";
import { ReceivedMemos } from "@/components/memos/ReceivedMemos";
import { SentMemos } from "@/components/memos/SentMemos";
import { MemoGeneration } from "./MemoGeneration";
import { FileText, Send, Inbox, Mail } from "lucide-react";

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
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
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
            <TabsTrigger value="department" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Department
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="received" className="mt-6">
            <ReceivedMemos />
          </TabsContent>
          
          <TabsContent value="send" className="mt-6">
            <SendMemoForm />
          </TabsContent>
          
          <TabsContent value="sent" className="mt-6">
            <SentMemos />
          </TabsContent>
          
          <TabsContent value="department" className="mt-6">
            <MemoGeneration />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
