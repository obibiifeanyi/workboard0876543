import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Memos = () => {
  return (
    <Card className="glass-card border border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Memos</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Memo content will be implemented here</p>
      </CardContent>
    </Card>
  );
};