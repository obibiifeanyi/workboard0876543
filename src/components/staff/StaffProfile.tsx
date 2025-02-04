import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StaffProfile = () => {
  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Staff Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Staff profile content will be implemented here</p>
      </CardContent>
    </Card>
  );
};