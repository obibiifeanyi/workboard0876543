
import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateSiteForm } from "@/components/telecom/CreateSiteForm";

export const CreateSiteButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-[30px] bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          <MapPin className="h-4 w-4 mr-2" />
          Create Site
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Telecom Site</DialogTitle>
        </DialogHeader>
        <CreateSiteForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
