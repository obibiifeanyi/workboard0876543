import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MapPin, Users, BarChart3, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface TelecomSite {
  id: number;
  name: string;
  location: string;
  manager: string;
  clients: number;
  status: "Active" | "Maintenance" | "Offline";
  performance?: number;
}

const mockSites: TelecomSite[] = [
  {
    id: 1,
    name: "Tower Alpha",
    location: "Downtown Metro",
    manager: "John Doe",
    clients: 5,
    status: "Active",
    performance: 92,
  },
  {
    id: 2,
    name: "Station Beta",
    location: "Suburban Area",
    manager: "Jane Smith",
    clients: 3,
    status: "Maintenance",
    performance: 78,
  },
  {
    id: 3,
    name: "Tower Gamma",
    location: "Industrial Zone",
    manager: "Mike Johnson",
    clients: 7,
    status: "Active",
    performance: 95,
  },
];

export const TelecomSites = () => {
  const { toast } = useToast();
  const [selectedSite, setSelectedSite] = useState<TelecomSite | null>(null);

  const handleAction = (action: string, site: TelecomSite) => {
    setSelectedSite(site);
    toast({
      title: `${action} - ${site.name}`,
      description: `Initiated ${action.toLowerCase()} for ${site.name}`,
    });
  };

  return (
    <Card className="bg-gradient-card border-white/10 backdrop-blur-xl shadow-xl animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald">
          <MapPin className="h-5 w-5" />
          Telecom Sites Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white/70">Total Sites</p>
                  <MapPin className="h-4 w-4 text-emerald" />
                </div>
                <p className="text-2xl font-bold text-emerald mt-2">{mockSites.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white/70">Active Managers</p>
                  <Users className="h-4 w-4 text-emerald" />
                </div>
                <p className="text-2xl font-bold text-emerald mt-2">
                  {new Set(mockSites.map(site => site.manager)).size}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white/70">Total Clients</p>
                  <BarChart3 className="h-4 w-4 text-emerald" />
                </div>
                <p className="text-2xl font-bold text-emerald mt-2">
                  {mockSites.reduce((sum, site) => sum + site.clients, 0)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/70">Site Name</TableHead>
                <TableHead className="text-white/70">Location</TableHead>
                <TableHead className="text-white/70">Manager</TableHead>
                <TableHead className="text-white/70">Performance</TableHead>
                <TableHead className="text-white/70">Status</TableHead>
                <TableHead className="text-white/70">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSites.map((site) => (
                <TableRow key={site.id} className="border-white/10">
                  <TableCell className="text-white">{site.name}</TableCell>
                  <TableCell className="text-white">{site.location}</TableCell>
                  <TableCell className="text-white">{site.manager}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald rounded-full"
                          style={{ width: `${site.performance}%` }}
                        />
                      </div>
                      <span className="text-sm text-white/70">{site.performance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        site.status === "Active"
                          ? "bg-emerald/20 text-emerald"
                          : site.status === "Maintenance"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {site.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald hover:bg-emerald/10"
                        onClick={() => handleAction("View Details", site)}
                      >
                        Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-yellow-500 hover:bg-yellow-500/10"
                        onClick={() => handleAction("Maintenance", site)}
                      >
                        Maintain
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};