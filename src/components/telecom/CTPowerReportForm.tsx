
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TelecomSiteSelector } from "./TelecomSiteSelector";
import { Zap } from "lucide-react";

const ctPowerReportSchema = z.object({
  site_id: z.string().min(1, "Site selection is required"),
  report_number: z.string().optional(),
  diesel_level: z.number().min(0).max(100, "Diesel level must be between 0-100%"),
  generator_runtime: z.number().min(0, "Runtime must be positive"),
  power_reading: z.number().optional(),
  battery_status: z.string().optional(),
  status: z.string().default("operational"),
  comments: z.string().optional(),
});

type CTPowerReportFormData = z.infer<typeof ctPowerReportSchema>;

interface CTPowerReportFormProps {
  onSuccess?: () => void;
}

export const CTPowerReportForm = ({ onSuccess }: CTPowerReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CTPowerReportFormData>({
    resolver: zodResolver(ctPowerReportSchema),
    defaultValues: {
      site_id: '',
      status: 'operational',
      diesel_level: 0,
      generator_runtime: 0,
    },
  });

  const onSubmit = async (data: CTPowerReportFormData) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log('Submitting CT Power Report:', data);

      const reportData = {
        site_id: data.site_id,
        report_datetime: new Date().toISOString(),
        diesel_level: data.diesel_level,
        generator_runtime: data.generator_runtime,
        power_reading: data.power_reading || null,
        battery_status: data.battery_status || null,
        comments: data.comments || null,
        status: data.status,
        report_number: data.report_number || null,
        created_by: user.id,
      };

      const { error } = await supabase
        .from('ct_power_reports')
        .insert(reportData);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('CT Power report submitted successfully');

      toast({
        title: "Success",
        description: "CT Power report submitted successfully",
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating CT power report:', error);
      toast({
        title: "Error",
        description: `Failed to submit CT power report: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          CT Power Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="site_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Site *</FormLabel>
                  <FormControl>
                    <TelecomSiteSelector
                      selectedSiteId={field.value}
                      onSiteSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="report_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Number</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-[30px]" placeholder="Enter Report Number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-[30px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="maintenance_required">Maintenance Required</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diesel_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diesel Level (%) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="rounded-[30px]"
                        placeholder="Enter diesel level percentage" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="generator_runtime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generator Runtime (hours) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="rounded-[30px]"
                        placeholder="Enter runtime hours" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="power_reading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Power Reading (kW)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        className="rounded-[30px]"
                        placeholder="Enter power reading" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="battery_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Battery Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-[30px]">
                          <SelectValue placeholder="Select battery status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="charging">Charging</SelectItem>
                        <SelectItem value="discharging">Discharging</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="rounded-[30px]" placeholder="Additional comments or observations" rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full rounded-[30px]" disabled={isSubmitting}>
              {isSubmitting ? "Submitting Report..." : "Submit CT Power Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
