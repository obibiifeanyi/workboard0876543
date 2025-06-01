
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TelecomSiteRow } from "@/integrations/supabase/types/telecom";

const siteSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  site_number: z.string().min(1, "Site number is required"),
  location: z.string().min(1, "Location is required"),
  address: z.string().optional(),
  region: z.string().optional(),
  status: z.enum(["active", "maintenance", "inactive", "planned"]),
});

type SiteFormData = z.infer<typeof siteSchema>;

interface EditSiteFormProps {
  site: TelecomSiteRow;
  onSuccess: () => void;
}

export const EditSiteForm = ({ site, onSuccess }: EditSiteFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      name: site.name,
      site_number: site.site_number || "",
      location: site.location,
      address: site.address || "",
      region: site.region || "",
      status: (site.status as "active" | "maintenance" | "inactive" | "planned") || "active",
    },
  });

  const onSubmit = async (data: SiteFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('telecom_sites')
        .update({
          name: data.name,
          site_number: data.site_number,
          location: data.location,
          address: data.address || null,
          region: data.region || null,
          status: data.status,
        })
        .eq('id', site.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Telecom site updated successfully",
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating site:', error);
      toast({
        title: "Error",
        description: "Failed to update telecom site",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Name</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-[30px]" placeholder="Enter site name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="site_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Number</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-[30px]" placeholder="Enter site number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-[30px]" placeholder="Enter location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-[30px]" placeholder="Enter region" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-[30px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-[30px] min-h-[80px]" placeholder="Enter full address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            type="submit" 
            className="rounded-[30px] flex-1" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Site"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
