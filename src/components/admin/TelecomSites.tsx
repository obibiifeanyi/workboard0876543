import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MapPin, Users, BarChart3, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { TelecomStatsCard } from "../telecom/TelecomStatsCard";
import { TelecomStatusBadge } from "../telecom/TelecomStatusBadge";
import { TelecomPerformanceIndicator } from "../telecom/TelecomPerformanceIndicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TelecomSite {
  id: number;
  name: string;
  location: string;
  manager: string;
  clients: number;
  status: "active" | "maintenance" | "inactive";
  performance?: number;
}

const mockSites: TelecomSite[] = [
  {
    id: 1,
    name: "Tower Alpha",
    location: "Downtown Metro",
    manager: "John Doe",
    clients: 5,
    status: "active",
    performance: 92,
  },
  {
    id: 2,
    name: "Station Beta",
    location: "Suburban Area",
    manager: "Jane Smith",
    clients: 3,
    status: "maintenance",
    performance: 78,
  },
  {
    id: 3,
    name: "Tower Gamma",
    location: "Industrial Zone",
    manager: "Mike Johnson",
    clients: 7,
    status: "active",
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
            <TelecomStatsCard
              title="Total Sites"
              value={mockSites.length}
              icon={MapPin}
            />
            <TelecomStatsCard
              title="Active Managers"
              value={new Set(mockSites.map(site => site.manager)).size}
              icon={Users}
            />
            <TelecomStatsCard
              title="Total Clients"
              value={mockSites.reduce((sum, site) => sum + site.clients, 0)}
              icon={BarChart3}
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">Site Name</TableHead>
                  <TableHead className="text-white/70 hidden md:table-cell">Location</TableHead>
                  <TableHead className="text-white/70 hidden lg:table-cell">Manager</TableHead>
                  <TableHead className="text-white/70 hidden sm:table-cell">Performance</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSites.map((site) => (
                  <TableRow key={site.id} className="border-white/10">
                    <TableCell className="text-white">{site.name}</TableCell>
                    <TableCell className="text-white hidden md:table-cell">{site.location}</TableCell>
                    <TableCell className="text-white hidden lg:table-cell">{site.manager}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <TelecomPerformanceIndicator performance={site.performance || 0} />
                    </TableCell>
                    <TableCell>
                      <TelecomStatusBadge status={site.status} />
                    </TableCell>
                    <TableCell>
                      {/* Desktop view buttons */}
                      <div className="hidden sm:flex gap-2">
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

                      {/* Mobile view dropdown */}
                      <div className="sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleAction("View Details", site)}
                              className="text-emerald"
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAction("Maintenance", site)}
                              className="text-yellow-500"
                            >
                              Maintenance
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};