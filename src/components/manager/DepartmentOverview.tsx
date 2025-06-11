import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useManagerOperations } from "@/hooks/manager/useManagerOperations";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export function DepartmentOverview() {
  const {
    departments,
    memos,
    reports,
    isLoadingDepartments,
    isLoadingMemos,
    isLoadingReports,
    updateMemoStatus,
    updateReportStatus
  } = useManagerOperations();

  const [activeTab, setActiveTab] = useState("departments");

  if (isLoadingDepartments) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="memos">Memos</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          {departments?.map((dept) => (
            <Card key={dept.department_id}>
              <CardHeader>
                <CardTitle>{dept.department_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{dept.department_description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="memos" className="space-y-4">
          {isLoadingMemos ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              {memos?.map((memo) => (
                <Card key={memo.id} className="mb-4">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{memo.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(memo.created_at), "PPP")}
                        </p>
                      </div>
                      <Badge variant={memo.status === "pending" ? "default" : "secondary"}>
                        {memo.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{memo.content}</p>
                    {memo.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateMemoStatus.mutate({ memoId: memo.id, status: "approved" })}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateMemoStatus.mutate({ memoId: memo.id, status: "rejected" })}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {isLoadingReports ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              {reports?.map((report) => (
                <Card key={report.id} className="mb-4">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{report.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(report.created_at), "PPP")}
                        </p>
                      </div>
                      <Badge variant={report.status === "pending" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{report.content}</p>
                    {report.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateReportStatus.mutate({ reportId: report.id, status: "approved" })}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateReportStatus.mutate({ reportId: report.id, status: "rejected" })}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 