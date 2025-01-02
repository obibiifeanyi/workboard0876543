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
      <div>
        <h2 className="text-2xl font-bold">Telecom Sites</h2>
        <p className="text-muted-foreground">Monitor site performance and status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockSites.map((site) => (
          <Card key={site.id} className="bg-black/10 border-none shadow-lg rounded-2xl hover:bg-black/20 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <MapPin className="h-5 w-5" />
                {site.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">{site.location}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span>{site.performance}%</span>
                    </div>
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${site.performance}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl"
                    onClick={() => handleAction("View Analytics", site.name)}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl"
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