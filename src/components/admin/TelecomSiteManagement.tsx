import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, Edit2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TelecomSite {
  id: string;
  siteId: string;
  name: string;
  location: string;
  status: "active" | "maintenance" | "inactive";
  workers: string[];
}

const mockSites: TelecomSite[] = [
  {
    id: "1",
    siteId: "SITE-001",
    name: "Tower Alpha",
    location: "Downtown Metro",
    status: "active",
    workers: ["John Doe", "Jane Smith"],
  },
  {
    id: "2",
    siteId: "SITE-002",
    name: "Station Beta",
    location: "Suburban Area",
    status: "maintenance",
    workers: ["Mike Johnson"],
  },
];

export const TelecomSiteManagement = () => {
  const [sites, setSites] = useState<TelecomSite[]>(mockSites);
  const [selectedSite, setSelectedSite] = useState<TelecomSite | null>(null);
  const { toast } = useToast();

  const generateSiteId = () => {
    const nextNumber = (sites.length + 1).toString().padStart(3, "0");
    return `SITE-${nextNumber}`;
  };

  const handleAddSite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newSite: TelecomSite = {
      id: Date.now().toString(),
      siteId: generateSiteId(),
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      status: "active",
      workers: (formData.get("workers") as string).split(",").map(w => w.trim()),
    };

    setSites([...sites, newSite]);
    toast({
      title: "Site Added",
      description: `New site ${newSite.name} has been added with ID: ${newSite.siteId}`,
    });
  };

  const handleUpdateSite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSite) return;

    const formData = new FormData(e.currentTarget);
    const updatedSites = sites.map(site => {
      if (site.id === selectedSite.id) {
        return {
          ...site,
          name: formData.get("name") as string,
          location: formData.get("location") as string,
          status: formData.get("status") as "active" | "maintenance" | "inactive",
          workers: (formData.get("workers") as string).split(",").map(w => w.trim()),
        };
      }
      return site;
    });

    setSites(updatedSites);
    setSelectedSite(null);
    toast({
      title: "Site Updated",
      description: "Site details have been updated successfully.",
    });
  };

  return (
    <Card className="bg-black/10 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Telecom Sites Management
        </CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Telecom Site</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSite} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Site Name</label>
                <Input name="name" required />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input name="location" required />
              </div>
              <div>
                <label className="text-sm font-medium">Workers (comma-separated)</label>
                <Input name="workers" placeholder="John Doe, Jane Smith" required />
              </div>
              <Button type="submit" className="w-full">Add Site</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sites.map((site) => (
            <div
              key={site.id}
              className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:bg-white/5"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary">{site.siteId}</span>
                  <span className="text-lg">{site.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{site.location}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{site.workers.join(", ")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    site.status === "active"
                      ? "bg-green-500/20 text-green-500"
                      : site.status === "maintenance"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {site.status}
                </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedSite(site)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Site: {site.siteId}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateSite} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Site Name</label>
                        <Input
                          name="name"
                          defaultValue={site.name}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          name="location"
                          defaultValue={site.location}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select name="status" defaultValue={site.status}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Workers</label>
                        <Input
                          name="workers"
                          defaultValue={site.workers.join(", ")}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">Update Site</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};