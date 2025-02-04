import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Meetings = () => {
  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Meetings</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Meetings content will be implemented here</p>
      </CardContent>
    </Card>
  );
};