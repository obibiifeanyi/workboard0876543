import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AccountPage = () => {
  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Account settings content will be implemented here</p>
      </CardContent>
    </Card>
  );
};