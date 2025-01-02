import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TelecomSiteForm } from "./TelecomSiteForm";
import { TelecomSiteCard } from "./TelecomSiteCard";
import { useState } from "react";

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

export const TelecomSiteList = () => {
  const [sites, setSites] = useState<TelecomSite[]>(mockSites);

  const generateSiteId = () => {
    const nextNumber = (sites.length + 1).toString().padStart(3, "0");
    return `SITE-${nextNumber}`;
  };

  const handleAddSite = (formData: FormData) => {
    const newSite: TelecomSite = {
      id: Date.now().toString(),
      siteId: generateSiteId(),
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      status: "active",
      workers: (formData.get("workers") as string).split(",").map(w => w.trim()),
    };

    setSites([...sites, newSite]);
  };

  const handleUpdateSite = (siteId: string, formData: FormData) => {
    const updatedSites = sites.map(site => {
      if (site.id === siteId) {
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
            <TelecomSiteForm type="add" onSubmit={handleAddSite} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sites.map((site) => (
            <TelecomSiteCard
              key={site.id}
              site={site}
              onUpdate={handleUpdateSite}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};