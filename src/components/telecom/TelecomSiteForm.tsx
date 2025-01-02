import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TelecomSiteFormProps {
  onSubmit: (formData: FormData) => void;
  defaultValues?: {
    name?: string;
    location?: string;
    status?: string;
    workers?: string;
  };
  type: "add" | "edit";
}

export const TelecomSiteForm = ({ onSubmit, defaultValues, type }: TelecomSiteFormProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
    toast({
      title: `Site ${type === "add" ? "Added" : "Updated"}`,
      description: `Site has been successfully ${type === "add" ? "added" : "updated"}.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Site Name</label>
        <Input name="name" defaultValue={defaultValues?.name} required />
      </div>
      <div>
        <label className="text-sm font-medium">Location</label>
        <Input name="location" defaultValue={defaultValues?.location} required />
      </div>
      {type === "edit" && (
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select name="status" defaultValue={defaultValues?.status || "active"}>
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
      )}
      <div>
        <label className="text-sm font-medium">Workers (comma-separated)</label>
        <Input
          name="workers"
          placeholder="John Doe, Jane Smith"
          defaultValue={defaultValues?.workers}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        {type === "add" ? "Add Site" : "Update Site"}
      </Button>
    </form>
  );
};