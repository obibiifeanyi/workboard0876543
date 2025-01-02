import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MapPin, Users, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockSites = [
  {
    id: 1,
    name: "Tower Alpha",
    location: "Downtown Metro",
    manager: "John Doe",
    clients: 5,
    status: "Active",
  },
  {
    id: 2,
    name: "Station Beta",
    location: "Suburban Area",
    manager: "Jane Smith",
    clients: 3,
    status: "Maintenance",
  },
];

export const TelecomSites = () => {
  const { toast } = useToast();

  return (
    <Card className="bg-gradient-card border-white/10 backdrop-blur-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald">
          <MapPin className="h-5 w-5" />
          Telecom Sites
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
                <p className="text-2xl font-bold text-emerald mt-2">8</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white/70">Active Managers</p>
                  <Users className="h-4 w-4 text-emerald" />
                </div>
                <p className="text-2xl font-bold text-emerald mt-2">12</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white/70">Total Clients</p>
                  <BarChart3 className="h-4 w-4 text-emerald" />
                </div>
                <p className="text-2xl font-bold text-emerald mt-2">24</p>
              </CardContent>
            </Card>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/70">Site Name</TableHead>
                <TableHead className="text-white/70">Location</TableHead>
                <TableHead className="text-white/70">Manager</TableHead>
                <TableHead className="text-white/70">Clients</TableHead>
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
                  <TableCell className="text-white">{site.clients}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        site.status === "Active"
                          ? "bg-emerald/20 text-emerald"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {site.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald hover:bg-emerald/10"
                      onClick={() => {
                        toast({
                          title: "Site Management",
                          description: `Managing ${site.name}`,
                        });
                      }}
                    >
                      Manage
                    </Button>
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