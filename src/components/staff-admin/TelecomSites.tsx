import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

interface TelecomSite {
  id: string;
  name: string;
  location: string;
  status: string;
  performance: number;
}

const mockTelecomSites: TelecomSite[] = [
  {
    id: "1",
    name: "Tower A",
    location: "City Center",
    status: "Operational",
    performance: 98,
  },
  {
    id: "2",
    name: "Station B",
    location: "Rural Area",
    status: "Maintenance",
    performance: 75,
  },
  {
    id: "3",
    name: "Antenna C",
    location: "Industrial Zone",
    status: "Operational",
    performance: 92,
  },
];

export const TelecomSites = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operational":
        return "bg-green-100 text-green-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Telecom Sites Management</h2>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Telecom Sites</CardTitle>
          <Button><Plus className="mr-2 h-4 w-4" /> Add Site</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance (%)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTelecomSites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{site.location}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(site.status)}>{site.status}</Badge>
                  </TableCell>
                  <TableCell>{site.performance}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="mr-2"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}; 