
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
import { Radio, Send } from "lucide-react";
import { TelecomSiteSelector } from "./TelecomSiteSelector";

const reportSchema = z.object({
  site_id: z.string().min(1, "Site selection is required"),
  report_type: z.enum(["maintenance", "inspection", "incident", "performance", "power", "battery"]),
  signal_strength: z.string().optional(),
  network_status: z.enum(["operational", "degraded", "down", "maintenance"]),
  equipment_status: z.enum(["good", "fair", "poor", "needs_repair", "out_of_service"]),
  issues_reported: z.string().optional(),
  maintenance_required: z.boolean().default(false),
  recommendations: z.string().optional(),
  power_reading: z.string().optional(),
  battery_status: z.string().optional(),
  diesel_level: z.string().optional(),
  generator_runtime: z.string().optional(),
  comments: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export const TelecomReportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      site_id: "",
      report_type: "maintenance",
      network_status: "operational",
      equipment_status: "good",
      maintenance_required: false,
    },
  });

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log('Submitting telecom report:', data);

      // Create CT Power Report entry
      const { error: powerReportError } = await supabase
        .from('ct_power_reports')
        .insert({
          site_id: data.site_id,
          report_datetime: new Date().toISOString(),
          power_reading: data.power_reading ? parseFloat(data.power_reading) : null,
          battery_status: data.battery_status,
          diesel_level: data.diesel_level ? parseFloat(data.diesel_level) : null,
          generator_runtime: data.generator_runtime ? parseFloat(data.generator_runtime) : null,
          comments: data.comments,
          status: data.network_status,
          created_by: user.id,
        });

      if (powerReportError) {
        console.error('Error creating power report:', powerReportError);
        throw powerReportError;
      }

      // Create Site Report entry
      const { error: siteReportError } = await supabase
        .from('site_reports')
        .insert({
          site_id: data.site_id,
          report_type: data.report_type,
          title: `${data.report_type} Report - ${new Date().toLocaleDateString()}`,
          description: data.comments || `${data.report_type} report for telecom site`,
          data: {
            signal_strength: data.signal_strength,
            network_status: data.network_status,
            equipment_status: data.equipment_status,
            power_reading: data.power_reading,
            battery_status: data.battery_status,
            diesel_level: data.diesel_level,
            generator_runtime: data.generator_runtime,
            maintenance_required: data.maintenance_required,
          },
          reported_by: user.id,
          report_date: new Date().toISOString(),
          status: 'submitted',
        });

      if (siteReportError) {
        console.error('Error creating site report:', siteReportError);
        throw siteReportError;
      }

      console.log('Telecom report submitted successfully');

      toast({
        title: "Report Submitted",
        description: "Your telecom site report has been submitted successfully",
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: `Failed to submit report: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Radio className="h-5 w-5 text-primary" />
          Telecom Site Report
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
                name="network_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Network Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-[30px]">
                          <SelectValue placeholder="Select network status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="degraded">Degraded</SelectItem>
                        <SelectItem value="down">Down</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="equipment_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-[30px]">
                          <SelectValue placeholder="Select equipment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="needs_repair">Needs Repair</SelectItem>
                        <SelectItem value="out_of_service">Out of Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="signal_strength"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="power_reading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Power Reading (kW)</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-[30px]" placeholder="e.g. 15.5" />
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
                    <FormControl>
                      <Input {...field} className="rounded-[30px]" placeholder="e.g. Good, 85%" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="diesel_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diesel Level (%)</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-[30px]" placeholder="e.g. 75" />
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
                    <FormLabel>Generator Runtime (hours)</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-[30px]" placeholder="e.g. 2.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="issues_reported"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issues Reported</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="rounded-[30px]" placeholder="Describe any issues found..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommendations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommendations</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="rounded-[30px]" placeholder="Provide recommendations..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="rounded-[30px]" placeholder="Any additional comments..." />
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
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting Report..." : "Submit Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
