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
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Telecom Sites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Total Sites</p>
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">8</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Active Managers</p>
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">12</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Total Clients</p>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">24</p>
              </CardContent>
            </Card>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>{site.location}</TableCell>
                  <TableCell>{site.manager}</TableCell>
                  <TableCell>{site.clients}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        site.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {site.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
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