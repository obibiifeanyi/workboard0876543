
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

const reportSchema = z.object({
  report_type: z.enum(["maintenance", "inspection", "incident", "performance", "power", "battery"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  data: z.object({
    temperature: z.string().optional(),
    humidity: z.string().optional(),
    signal_strength: z.string().optional(),
    power_status: z.string().optional(),
    battery_level: z.string().optional(),
    issues_found: z.string().optional(),
    actions_taken: z.string().optional(),
  }).optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface SiteReportFormProps {
  siteId: string;
  onSuccess: () => void;
}

export const SiteReportForm = ({ siteId, onSuccess }: SiteReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      report_type: "maintenance",
    },
  });

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('site_reports')
        .insert({
          site_id: siteId,
          report_type: data.report_type,
          title: data.title,
          description: data.description,
          data: data.data || {},
          reported_by: user.user.id,
          report_date: new Date().toISOString(),
        });

      if (error) throw error;

      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: "Error",
        description: "Failed to create site report",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="report_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-[30px]">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="power">Power</SelectItem>
                    <SelectItem value="battery">Battery</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Title</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-[30px]" placeholder="Enter report title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-[30px]" placeholder="Detailed report description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="data.temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temperature (°C)</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-[30px]" placeholder="e.g. 25.5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data.humidity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Humidity (%)</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-[30px]" placeholder="e.g. 65" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data.signal_strength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signal Strength (dBm)</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-[30px]" placeholder="e.g. -75" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data.battery_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Battery Level (%)</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-[30px]" placeholder="e.g. 85" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="data.issues_found"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issues Found</FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-[30px]" placeholder="Describe any issues found during inspection" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data.actions_taken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actions Taken</FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-[30px]" placeholder="Describe actions taken to resolve issues" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full rounded-[30px]" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Report..." : "Create Report"}
        </Button>
      </form>
    </Form>
  );
};
