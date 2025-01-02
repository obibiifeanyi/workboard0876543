import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, BarChart3, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockSites = [
  {
    id: 1,
    name: "Tower Alpha",
    location: "Downtown Metro",
    performance: 92,
    status: "Active",
  },
  {
    id: 2,
    name: "Station Beta",
    location: "Suburban Area",
    performance: 85,
    status: "Maintenance",
  },
];

export const TelecomSites = () => {
  const { toast } = useToast();

  const handleAction = (action: string, siteName: string) => {
    toast({
      title: action,
      description: `Action ${action} for site ${siteName}`,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Telecom Sites</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {mockSites.map((site) => (
          <Card key={site.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {site.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{site.location}</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span>{site.performance}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${site.performance}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction("View Analytics", site.name)}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction("Submit Report", site.name)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};