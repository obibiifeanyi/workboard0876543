
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminDashboardModuleProps {
  activeTab: string;
}

export const AdminDashboardModule = ({ activeTab }: AdminDashboardModuleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Analytics content for {activeTab} will be displayed here.</p>
      </CardContent>
    </Card>
  );
};
