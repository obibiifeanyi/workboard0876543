import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface TelecomStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export const TelecomStatsCard = ({ title, value, icon: Icon }: TelecomStatsCardProps) => {
  return (
    <Card className="bg-gradient-card border-white/10">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white/70">{title}</p>
          <Icon className="h-4 w-4 text-emerald" />
        </div>
        <p className="text-2xl font-bold text-emerald mt-2">{value}</p>
      </CardContent>
    </Card>
  );
};