import { Button } from "@/components/ui/button";
import { Edit2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TelecomSiteForm } from "./TelecomSiteForm";

interface TelecomSite {
  id: string;
  siteId: string;
  name: string;
  location: string;
  status: "active" | "maintenance" | "inactive";
  workers: string[];
}

interface TelecomSiteCardProps {
  site: TelecomSite;
  onUpdate: (siteId: string, formData: FormData) => void;
}

export const TelecomSiteCard = ({ site, onUpdate }: TelecomSiteCardProps) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:bg-white/5">
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
            <Button variant="ghost" size="icon">
              <Edit2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Site: {site.siteId}</DialogTitle>
            </DialogHeader>
            <TelecomSiteForm
              type="edit"
              onSubmit={(formData) => onUpdate(site.id, formData)}
              defaultValues={{
                name: site.name,
                location: site.location,
                status: site.status,
                workers: site.workers.join(", "),
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};